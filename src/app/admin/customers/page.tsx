import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import Reveal from "@/frontend/components/motion/Reveal";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";
import CustomerSearchBar from "@/frontend/components/admin/CustomerSearchBar";
import type { Prisma } from "@prisma/client";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where: Prisma.UserWhereInput = { role: "CUSTOMER" };
  if (q?.trim()) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  const customers = await prisma.user.findMany({
    where,
    include: { orders: { select: { total: true, status: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = customers.map((customer) => {
    const paidOrders = customer.orders.filter((o) => o.status === "PAID" || o.status === "FULFILLED");
    const totalSpent = paidOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      id: customer.id,
      name: customer.name ?? "—",
      email: customer.email,
      joined: customer.createdAt,
      orderCount: customer.orders.length,
      totalSpent,
    };
  });

  return (
    <div>
      <Reveal className="mb-6">
        <h1 className="text-2xl font-extrabold text-text">Customers</h1>
        <p className="mt-1 text-sm text-text/50">{customers.length} registered customers</p>
      </Reveal>

      <CustomerSearchBar />

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <Users className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">{q ? "No customers match this search." : "No registered customers yet."}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <AnimatedTableBody>
                {rows.map((customer) => (
                  <AnimatedTableRow key={customer.id}>
                    <td className="px-4 py-3 font-medium text-text">
                      <Link href={`/admin/customers/${customer.id}`} className="hover:text-gold-600">
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text/60">{customer.email}</td>
                    <td className="px-4 py-3 text-text/60">{customer.joined.toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 text-text/60">{customer.orderCount}</td>
                    <td className="px-4 py-3 font-medium text-text">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-text/50 hover:text-gold-600"
                      >
                        View <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
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
