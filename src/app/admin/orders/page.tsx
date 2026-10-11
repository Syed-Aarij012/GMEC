import { ShoppingBag } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { buildOrdersWhere, getOrderReference, type OrdersSearchParams } from "@/backend/lib/orders";
import OrdersFilterBar from "@/frontend/components/admin/OrdersFilterBar";
import OrdersTable, { type OrderRow } from "@/frontend/components/admin/OrdersTable";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<OrdersSearchParams>;
}) {
  const params = await searchParams;
  const where = buildOrdersWhere(params);

  const orders = await prisma.order.findMany({
    where,
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows: OrderRow[] = orders.map((order) => ({
    id: order.id,
    orderReference: getOrderReference(order.id, order.invoiceNumber),
    customer: order.user?.name ?? order.user?.email ?? order.guestEmail ?? "Guest",
    itemCount: order.items.length,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
  }));

  const hasFilters = Boolean(params.q || params.status || params.from || params.to);

  return (
    <div>
      <Reveal className="mb-6">
        <h1 className="text-2xl font-extrabold text-text">Orders</h1>
        <p className="mt-1 text-sm text-text/50">
          {orders.length} order{orders.length === 1 ? "" : "s"}
          {hasFilters ? " matching filters" : " placed"}
        </p>
      </Reveal>

      <OrdersFilterBar />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">
            {hasFilters ? "No orders match these filters." : "No orders yet."}
          </p>
        </div>
      ) : (
        <OrdersTable orders={rows} />
      )}
    </div>
  );
}
