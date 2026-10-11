import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/backend/lib/auth";
import { prisma } from "@/backend/lib/prisma";
import { getOrderReference } from "@/backend/lib/orders";
import { formatPrice } from "@/frontend/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="container-page py-10">
      <Link href="/account" className="mb-6 flex items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600">
        <ChevronLeft className="h-4 w-4" /> Back to account
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">
            Order {getOrderReference(order.id, order.invoiceNumber)}
          </h1>
          <p className="mt-1 text-sm text-text/50">
            Placed on {order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}Status: <span className="font-semibold">{order.status}</span>
          </p>
        </div>
        <Link
          href={`/invoice/${order.id}`}
          className="rounded-full border border-line/15 px-4 py-2 text-sm font-semibold text-text hover:border-gold-500 hover:text-gold-600"
        >
          View Invoice
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-line/10 p-6">
          <h2 className="text-lg font-bold text-text">Items</h2>
          <ul className="mt-4 divide-y divide-line/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <span className="text-text/70">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-text">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line/10 p-6">
            <h2 className="text-lg font-bold text-text">Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-text/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text/70">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-line/10 pt-2 text-base font-bold text-text">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-canvas-muted p-6 text-sm text-text/70">
            <p className="font-semibold text-text">Delivery Address</p>
            <p className="mt-2">{order.shippingName}</p>
            <p>{order.shippingLine1}{order.shippingLine2 ? `, ${order.shippingLine2}` : ""}</p>
            <p>{order.shippingCity}, {order.shippingPostcode}</p>
            <p>{order.shippingCountry}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
