import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import ClearCartOnMount from "@/frontend/components/checkout/ClearCartOnMount";
import SuccessCheck from "@/frontend/components/checkout/SuccessCheck";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container-page py-16">
      {/* Google Ads Purchase conversion. transaction_id is order.id, so Google
       * dedupes repeat conversions if the customer refreshes this page. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            gtag('event', 'conversion', {
              'send_to': 'AW-18486543483/0WofCJLT2owdEPuIie9E',
              'value': ${JSON.stringify(order.total)},
              'currency': 'GBP',
              'transaction_id': ${JSON.stringify(order.id)}
            });
          `,
        }}
      />
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl text-center">
        <SuccessCheck />
        <Reveal delay={0.2}>
          <h1 className="mt-4 text-3xl font-extrabold text-text">Thank you for your order!</h1>
          <p className="mt-2 text-text/60">
            Order confirmation has been sent. Your order reference is{" "}
            <span className="font-semibold text-text">#{order.id.slice(-8).toUpperCase()}</span>.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.35} className="mx-auto mt-10 max-w-2xl rounded-2xl border border-line/10 p-6">
        <h2 className="text-lg font-bold text-text">Order Summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-text/70">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-text">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-line/10 pt-4 text-sm">
          <div className="flex justify-between text-text/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-text/70">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-text">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-canvas-muted p-4 text-sm text-text/70">
          <p className="font-semibold text-text">Delivering to</p>
          <p>{order.shippingName}</p>
          <p>{order.shippingLine1}{order.shippingLine2 ? `, ${order.shippingLine2}` : ""}</p>
          <p>{order.shippingCity}, {order.shippingPostcode}</p>
          <p>{order.shippingCountry}</p>
        </div>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/shop" className="inline-block rounded-full bg-ink-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950">
          Continue Shopping
        </Link>
        <Link
          href={`/invoice/${order.id}`}
          className="inline-block rounded-full border border-line/15 px-7 py-3 text-sm font-bold text-text hover:border-gold-500 hover:text-gold-600"
        >
          View Invoice
        </Link>
      </div>
    </div>
  );
}
