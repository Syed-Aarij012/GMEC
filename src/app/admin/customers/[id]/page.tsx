import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, MapPin, ShoppingBag } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import Reveal from "@/frontend/components/motion/Reveal";

const statusStyles: Record<string, string> = {
  PENDING: "bg-canvas-muted text-text/70",
  PAID: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  FULFILLED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
      addresses: true,
    },
  });

  if (!customer) notFound();

  const paidOrders = customer.orders.filter((o) => o.status === "PAID" || o.status === "FULFILLED");
  const totalSpent = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const defaultAddress = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];

  return (
    <div>
      <Link
        href="/admin/customers"
        className="mb-6 flex items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
      >
        <ChevronLeft className="h-4 w-4" /> Back to customers
      </Link>

      <Reveal>
        <h1 className="text-2xl font-extrabold text-text">{customer.name ?? "Unnamed customer"}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text/50">
          <Mail className="h-3.5 w-3.5" /> {customer.email}
        </p>
        <p className="mt-1 text-xs text-text/40">
          Joined {customer.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </Reveal>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-text">{customer.orders.length}</p>
          <p className="text-xs text-text/50">Total orders</p>
        </div>
        <div className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-text">{formatPrice(totalSpent)}</p>
          <p className="text-xs text-text/50">Lifetime spend</p>
        </div>
        <div className="col-span-2 rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm lg:col-span-1">
          <p className="text-2xl font-extrabold text-text">
            {customer.orders[0] ? customer.orders[0].createdAt.toLocaleDateString("en-GB") : "—"}
          </p>
          <p className="text-xs text-text/50">Last order</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Reveal delay={0.1} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text">
            <ShoppingBag className="h-4 w-4 text-text/40" /> Order History
          </h2>
          {customer.orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-text/50">No orders yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-line/10">
              {customer.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-canvas-muted"
                >
                  <div>
                    <p className="font-medium text-text">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-text/40">{order.createdAt.toLocaleDateString("en-GB")}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-text">{formatPrice(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-text">
            <MapPin className="h-4 w-4 text-text/40" /> Address
          </h2>
          {!defaultAddress ? (
            <p className="mt-3 text-sm text-text/50">No saved address.</p>
          ) : (
            <div className="mt-3 text-sm text-text/70">
              <p className="font-medium text-text">{defaultAddress.fullName}</p>
              <p>
                {defaultAddress.line1}
                {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
              </p>
              <p>
                {defaultAddress.city}, {defaultAddress.postcode}
              </p>
              <p>{defaultAddress.country}</p>
              {defaultAddress.phone && <p className="mt-1 text-text/50">{defaultAddress.phone}</p>}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
