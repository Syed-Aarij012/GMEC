"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/frontend/lib/utils";
import OrderStatusSelect from "@/frontend/components/admin/OrderStatusSelect";
import DeleteButton from "@/frontend/components/admin/DeleteButton";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export interface OrderRow {
  id: string;
  orderReference: string;
  customer: string;
  itemCount: number;
  total: number;
  createdAt: string;
  status: string;
}

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState(STATUSES[0]);
  const [applying, setApplying] = useState(false);

  const allSelected = orders.length > 0 && selected.size === orders.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(orders.map((o) => o.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function applyBulkStatus() {
    setApplying(true);
    const res = await fetch("/api/admin/orders/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), status: bulkStatus }),
    });
    setApplying(false);
    if (res.ok) {
      setSelected(new Set());
      router.refresh();
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-line/10 bg-canvas-muted px-4 py-3 text-sm">
          <span className="font-semibold text-text">{selected.size} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="rounded-full border border-line/15 bg-canvas px-3 py-1.5 text-xs font-semibold outline-none focus:border-gold-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Set to {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyBulkStatus}
            disabled={applying}
            className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-gold-600 hover:text-ink-950 disabled:opacity-60"
          >
            {applying ? "Applying…" : "Apply"}
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="text-xs font-semibold text-text/50 hover:text-text"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 rounded border-line/30"
                />
              </th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <AnimatedTableBody>
            {orders.map((order) => (
              <AnimatedTableRow key={order.id}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleOne(order.id)}
                    className="h-3.5 w-3.5 rounded border-line/30"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-text">
                  <Link href={`/admin/orders/${order.id}`} className="hover:text-gold-600">
                    {order.orderReference}
                  </Link>
                </td>
                <td className="px-4 py-3 text-text/60">{order.customer}</td>
                <td className="px-4 py-3 text-text/60">{order.itemCount}</td>
                <td className="px-4 py-3 font-medium text-text">{formatPrice(order.total)}</td>
                <td className="px-4 py-3 text-text/60">
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-text/50 hover:text-gold-600"
                    >
                      View <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteButton
                      url={`/api/admin/orders/${order.id}`}
                      confirmText={`Delete order ${order.orderReference}? This cannot be undone.`}
                    />
                  </div>
                </td>
              </AnimatedTableRow>
            ))}
          </AnimatedTableBody>
        </table>
      </div>
    </div>
  );
}
