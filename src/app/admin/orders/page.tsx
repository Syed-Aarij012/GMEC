import { ShoppingBag } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import OrderStatusSelect from "@/frontend/components/admin/OrderStatusSelect";
import Reveal from "@/frontend/components/motion/Reveal";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Reveal className="mb-6">
        <h1 className="text-2xl font-extrabold text-text">Orders</h1>
        <p className="mt-1 text-sm text-text/50">{orders.length} orders placed</p>
      </Reveal>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <AnimatedTableBody>
                {orders.map((order) => (
                  <AnimatedTableRow key={order.id}>
                    <td className="px-4 py-3 font-medium text-text">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-text/60">
                      {order.user?.name ?? order.user?.email ?? order.guestEmail ?? "Guest"}
                    </td>
                    <td className="px-4 py-3 text-text/60">{order.items.length}</td>
                    <td className="px-4 py-3 font-medium text-text">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-text/60">
                      {order.createdAt.toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect orderId={order.id} status={order.status} />
                    </td>
                  </AnimatedTableRow>
                ))}
              </AnimatedTableBody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
