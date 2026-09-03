import Link from "next/link";
import { Package, ShoppingBag, PoundSterling, FolderTree, ArrowUpRight } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { StaggerItem } from "@/frontend/components/motion/StaggerGrid";
import RevenueChart, { type RevenuePoint } from "@/frontend/components/admin/charts/RevenueChart";
import OrdersStatusBar from "@/frontend/components/admin/charts/OrdersStatusBar";
import TopProductsBar, { type TopProduct } from "@/frontend/components/admin/charts/TopProductsBar";

const statusStyles: Record<string, string> = {
  PENDING: "bg-canvas-muted text-text/70",
  PAID: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  FULFILLED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const PAID_STATUSES = ["PAID", "FULFILLED"] as const;
const REVENUE_DAYS = 30;

async function getRevenueSeries(): Promise<RevenuePoint[]> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (REVENUE_DAYS - 1));

  const orders = await prisma.order.findMany({
    where: { status: { in: [...PAID_STATUSES] }, createdAt: { gte: start } },
    select: { total: true, createdAt: true },
  });

  const revenueByDay = new Map<string, number>();
  for (let i = 0; i < REVENUE_DAYS; i++) {
    const day = new Date(start);
    day.setUTCDate(day.getUTCDate() + i);
    revenueByDay.set(day.toISOString().slice(0, 10), 0);
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.total);
  }

  return Array.from(revenueByDay, ([date, revenue]) => ({ date, revenue }));
}

async function getTopProducts(): Promise<TopProduct[]> {
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { in: [...PAID_STATUSES] } } },
    select: { productId: true, name: true, price: true, quantity: true },
  });

  const byProduct = new Map<string, TopProduct>();
  for (const item of items) {
    const amount = item.price * item.quantity;
    const existing = byProduct.get(item.productId);
    if (existing) existing.revenue += amount;
    else byProduct.set(item.productId, { name: item.name, revenue: amount });
  }

  return Array.from(byProduct.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export default async function AdminDashboardPage() {
  const [
    productCount,
    categoryCount,
    orderCount,
    recentOrders,
    statusCounts,
    revenueSeries,
    topProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    getRevenueSeries(),
    getTopProducts(),
  ]);

  const revenue = await prisma.order.aggregate({
    where: { status: { in: [...PAID_STATUSES] } },
    _sum: { total: true },
  });

  const orderStatusCounts: Record<string, number> = {};
  for (const row of statusCounts) orderStatusCounts[row.status] = row._count._all;

  const stats = [
    { icon: Package, label: "Products", value: productCount, accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { icon: FolderTree, label: "Categories", value: categoryCount, accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
    { icon: ShoppingBag, label: "Orders", value: orderCount, accent: "bg-green-500/10 text-green-600 dark:text-green-400" },
    { icon: PoundSterling, label: "Revenue", value: formatPrice(revenue._sum.total ?? 0), accent: "bg-gold-500/15 text-gold-600 dark:text-gold-400" },
  ];

  return (
    <div>
      <Reveal>
        <h1 className="text-2xl font-extrabold text-text">Dashboard</h1>
        <p className="mt-1 text-sm text-text/50">A quick overview of your store.</p>
      </Reveal>

      <StaggerGrid className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, accent }) => (
          <StaggerItem
            key={label}
            hoverLift
            className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-extrabold text-text">{value}</p>
            <p className="text-xs text-text/50">{label}</p>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Reveal delay={0.1} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-text">Revenue</h2>
          <p className="mb-4 text-xs text-text/50">Last {REVENUE_DAYS} days, paid &amp; fulfilled orders</p>
          <RevenueChart data={revenueSeries} />
        </Reveal>

        <Reveal delay={0.15} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-text">Top Products</h2>
          <p className="mb-4 text-xs text-text/50">By revenue, all time</p>
          <TopProductsBar data={topProducts} />
        </Reveal>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        <Reveal delay={0.2} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-text">Orders by Status</h2>
          <p className="mb-4 text-xs text-text/50">{orderCount} total</p>
          <OrdersStatusBar counts={orderStatusCounts} />
        </Reveal>

        <Reveal delay={0.25} className="rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-text/50">No orders yet.</p>
          ) : (
            <div className="divide-y divide-line/10">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-canvas-muted"
                >
                  <span className="font-medium text-text">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold text-text">{formatPrice(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
