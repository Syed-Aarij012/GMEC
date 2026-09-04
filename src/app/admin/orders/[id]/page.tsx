import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, User as UserIcon, CreditCard, Truck } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import OrderStatusSelect from "@/frontend/components/admin/OrderStatusSelect";
import RoyalMailShipment from "@/frontend/components/admin/RoyalMailShipment";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });

  if (!order) notFound();

  const paymentMethod = order.paypalOrderId ? "PayPal" : order.stripeSessionId ? "Stripe" : "Not started";
  const paymentReference = order.paypalOrderId ?? order.stripeSessionId ?? null;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
      >
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <Reveal className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-text/50">
            Placed on{" "}
            {order.createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            at {order.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/invoice/${order.id}`}
            className="rounded-full border border-line/15 px-4 py-2 text-sm font-semibold text-text hover:border-gold-500 hover:text-gold-600"
          >
            View Invoice
          </Link>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <Reveal delay={0.05} className="rounded-2xl border border-line/10 bg-canvas p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text">Items</h2>
          <ul className="mt-4 divide-y divide-line/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{item.name}</p>
                  <p className="text-text/50">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-text">{formatPrice(item.price * item.quantity)}</span>
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
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1} className="rounded-2xl border border-line/10 bg-canvas p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text">
              <UserIcon className="h-4 w-4 text-text/40" /> Customer
            </h2>
            <div className="mt-3 text-sm text-text/70">
              <p className="font-medium text-text">
                {order.user?.name ?? order.shippingName}
              </p>
              <p>{order.user?.email ?? order.guestEmail}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-text/40">
                {order.user ? "Registered customer" : "Guest checkout"}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="rounded-2xl border border-line/10 bg-canvas p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-text">
              <CreditCard className="h-4 w-4 text-text/40" /> Payment
            </h2>
            <div className="mt-3 space-y-1 text-sm text-text/70">
              <p>
                Method: <span className="font-medium text-text">{paymentMethod}</span>
              </p>
              {paymentReference && (
                <p className="break-all">
                  Reference: <span className="font-mono text-xs text-text/60">{paymentReference}</span>
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="rounded-2xl bg-canvas-muted p-6 text-sm text-text/70">
            <p className="font-semibold text-text">Delivery Address</p>
            <p className="mt-2">{order.shippingName}</p>
            <p>
              {order.shippingLine1}
              {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
            </p>
            <p>
              {order.shippingCity}, {order.shippingPostcode}
            </p>
            <p>{order.shippingCountry}</p>
          </Reveal>

          <Reveal delay={0.25} className="rounded-2xl border border-line/10 bg-canvas p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-text">
              <Truck className="h-4 w-4 text-text/40" /> Royal Mail
            </h2>
            <RoyalMailShipment
              orderId={order.id}
              royalMailOrderId={order.royalMailOrderId}
              trackingNumber={order.royalMailTrackingNumber}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
