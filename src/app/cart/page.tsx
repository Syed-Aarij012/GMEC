"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/frontend/lib/utils";
import { useMounted } from "@/frontend/hooks/useMounted";
import { FREE_DELIVERY_THRESHOLD } from "@/backend/lib/shipping";

const ESTIMATED_SHIPPING_FALLBACK = 4.99;

interface ShippingQuote {
  subtotal: number;
  shippingCost: number;
  total: number;
}

export default function CartPage() {
  const mounted = useMounted();
  const [quote, setQuote] = useState<ShippingQuote | null>(null);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
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

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <ShoppingBag className="h-14 w-14 text-text/20" />
        <h1 className="mt-4 text-2xl font-extrabold text-text">Your basket is empty</h1>
        <p className="mt-2 text-text/60">Browse our range and find something you&apos;ll love.</p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-ink-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const shipping =
    quote?.shippingCost ?? (subtotal > FREE_DELIVERY_THRESHOLD ? 0 : ESTIMATED_SHIPPING_FALLBACK);
  const total = quote?.total ?? subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 text-3xl font-extrabold text-text">Your Basket</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="flex gap-4 rounded-2xl border border-line/10 p-4"
            >
              <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-canvas-muted">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/product/${item.slug}`} className="font-semibold text-text hover:text-gold-600">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove item"
                    className="text-text/40 hover:text-red-600"
                  >
                    <Trash2 className="h-[18px] w-[18px]" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line/10">
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-text hover:text-gold-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="p-2 text-text hover:text-gold-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-bold text-text">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-2xl border border-line/10 p-6">
          <h2 className="text-lg font-bold text-text">Order Summary</h2>

          {subtotal <= FREE_DELIVERY_THRESHOLD ? (
            <p className="mt-3 rounded-lg bg-canvas-muted p-3 text-xs text-text/70">
              Add {formatPrice(remainingForFreeShipping)} more to get free UK delivery.
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-gold-500/10 p-3 text-xs font-semibold text-gold-700 dark:text-gold-400">
              You&apos;ve unlocked free UK delivery!
            </p>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-text/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-text/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-line/10 pt-2 text-base font-bold text-text">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
