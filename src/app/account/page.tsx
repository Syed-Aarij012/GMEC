import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Package, ChevronRight } from "lucide-react";
import { authOptions } from "@/backend/lib/auth";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-canvas-muted text-text/70",
  PAID: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  FULFILLED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-page py-10">
      <h1 className="mb-1 text-3xl font-extrabold text-text">My Account</h1>
      <p className="mb-8 text-text/60">
        Welcome back, {session.user.name ?? session.user.email}
      </p>

      <h2 className="mb-4 text-lg font-bold text-text">Order History</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 py-16 text-center">
          <Package className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="mt-4 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-line/10 p-4 hover:border-gold-500"
            >
              <div>
                <p className="font-semibold text-text">
                  Order #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-text/50">
                  {order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  {" · "}
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-bold text-text">{formatPrice(order.total)}</span>
                <ChevronRight className="h-4 w-4 text-text/40" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
