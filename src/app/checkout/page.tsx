"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Lock } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/frontend/lib/utils";
import { shippingSchema, type ShippingInput } from "@/backend/lib/validation";
import { useMounted } from "@/frontend/hooks/useMounted";
import { FREE_DELIVERY_THRESHOLD } from "@/backend/lib/shipping";

const ESTIMATED_SHIPPING_FALLBACK = 4.99;

interface ShippingQuote {
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: authSession } = useSession();
  const mounted = useMounted();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const paypalAvailable = Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemsKey = items.map((i) => `${i.productId}:${i.quantity}`).join(",");

  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    fetch("/api/shipping/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
    })
      .then((res) => res.json())
      .then((data: ShippingQuote) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "United Kingdom",
      email: authSession?.user?.email ?? "",
      fullName: authSession?.user?.name ?? "",
    },
  });

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/cart");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const shippingCost =
    quote?.shippingCost ?? (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : ESTIMATED_SHIPPING_FALLBACK);
  const total = quote?.total ?? subtotal + shippingCost;

  async function onSubmit(data: ShippingInput) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping: data,
          paymentMethod,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      // Full navigation (not router.push) since result.url may be an external Stripe URL.
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = result.url;
    } catch {
      setServerError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-3xl font-extrabold text-text">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h2 className="text-lg font-bold text-text">Shipping Details</h2>

          <Field label="Full Name" error={errors.fullName?.message}>
            <input {...register("fullName")} className={inputClass} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register("email")} className={inputClass} suppressHydrationWarning />
          </Field>
          <Field label="Address Line 1" error={errors.line1?.message}>
            <input {...register("line1")} className={inputClass} />
          </Field>
          <Field label="Address Line 2 (optional)" error={errors.line2?.message}>
            <input {...register("line2")} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" error={errors.city?.message}>
              <input {...register("city")} className={inputClass} />
            </Field>
            <Field label="Postcode" error={errors.postcode?.message}>
              <input {...register("postcode")} className={inputClass} />
            </Field>
          </div>
          <Field label="Country" error={errors.country?.message}>
            <input {...register("country")} className={inputClass} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <input {...register("phone")} className={inputClass} />
          </Field>

          {paypalAvailable && (
            <div>
              <span className="mb-1.5 block text-sm font-medium text-text">Payment Method</span>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-3.5 py-2.5 text-sm font-medium ${
                    paymentMethod === "stripe"
                      ? "border-gold-500 ring-1 ring-gold-500 text-text"
                      : "border-line/15 text-text/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="sr-only"
                  />
                  Card (Stripe)
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-3.5 py-2.5 text-sm font-medium ${
                    paymentMethod === "paypal"
                      ? "border-gold-500 ring-1 ring-gold-500 text-text"
                      : "border-line/15 text-text/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="sr-only"
                  />
                  PayPal
                </label>
              </div>
            </div>
          )}

          {serverError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {submitting
              ? "Processing..."
              : `Pay ${formatPrice(total)}${paymentMethod === "paypal" ? " with PayPal" : ""}`}
          </button>
          <p className="text-center text-xs text-text/50">
            Payments are processed securely by {paymentMethod === "paypal" ? "PayPal" : "Stripe"}.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-line/10 p-6">
          <h2 className="text-lg font-bold text-text">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-text/70">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-line/10 pt-4 text-sm">
            <div className="flex justify-between text-text/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text/70">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-text">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-line/15 bg-canvas px-3.5 py-2.5 text-sm text-text outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
