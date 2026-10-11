import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { buildOrdersWhere, getOrderReference, type OrdersSearchParams } from "@/backend/lib/orders";

function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const params: OrdersSearchParams = {
    q: url.searchParams.get("q") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  };
  const where = buildOrdersWhere(params);

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Order Ref",
    "Date",
    "Customer",
    "Email",
    "Items",
    "Subtotal",
    "Shipping",
    "Total",
    "Status",
    "Payment Method",
    "Shipping Address",
  ];

  const rows = orders.map((order) => [
    getOrderReference(order.id, order.invoiceNumber),
    order.createdAt.toISOString(),
    order.user?.name ?? order.shippingName,
    order.user?.email ?? order.guestEmail ?? "",
    String(order.items.length),
    order.subtotal.toFixed(2),
    order.shippingCost.toFixed(2),
    order.total.toFixed(2),
    order.status,
    order.paypalOrderId ? "PayPal" : order.stripeSessionId ? "Stripe" : "",
    `${order.shippingLine1}${order.shippingLine2 ? `, ${order.shippingLine2}` : ""}, ${order.shippingCity}, ${order.shippingPostcode}, ${order.shippingCountry}`,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
