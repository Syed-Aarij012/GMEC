import type { Prisma, OrderStatus } from "@prisma/client";

export const ORDER_STATUSES: OrderStatus[] = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export interface OrdersSearchParams {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
}

export function buildOrdersWhere(params: OrdersSearchParams): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  if (params.status && ORDER_STATUSES.includes(params.status as OrderStatus)) {
    where.status = params.status as OrderStatus;
  } else if (!params.status) {
    // No status filter picked: default to orders that actually completed
    // payment. Pending/cancelled orders are still reachable by explicitly
    // selecting that status in the filter — just not shown by default.
    where.status = { in: ["PAID", "FULFILLED"] };
  }

  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: new Date(`${params.from}T00:00:00`) } : {}),
      ...(params.to ? { lte: new Date(`${params.to}T23:59:59.999`) } : {}),
    };
  }

  const q = params.q?.trim();
  if (q) {
    where.OR = [
      { guestEmail: { contains: q, mode: "insensitive" } },
      { shippingName: { contains: q, mode: "insensitive" } },
      { user: { is: { email: { contains: q, mode: "insensitive" } } } },
      { user: { is: { name: { contains: q, mode: "insensitive" } } } },
      { id: { endsWith: q.toLowerCase() } },
    ];
  }

  return where;
}
