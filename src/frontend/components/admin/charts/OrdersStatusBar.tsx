import { ShoppingBag } from "lucide-react";

const STATUS_ORDER = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;

const STATUS_META: Record<(typeof STATUS_ORDER)[number], { label: string; bar: string; dot: string }> = {
  PENDING: { label: "Pending", bar: "bg-text/25", dot: "bg-text/40" },
  PAID: { label: "Paid", bar: "bg-gold-500", dot: "bg-gold-500" },
  FULFILLED: { label: "Fulfilled", bar: "bg-green-500", dot: "bg-green-500" },
  CANCELLED: { label: "Cancelled", bar: "bg-red-500", dot: "bg-red-500" },
};

export default function OrdersStatusBar({ counts }: { counts: Record<string, number> }) {
  const total = STATUS_ORDER.reduce((sum, s) => sum + (counts[s] ?? 0), 0);

  if (total === 0) {
    return (
      <div className="flex h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-line/15 text-center">
        <ShoppingBag className="h-8 w-8 text-text/20" />
        <p className="mt-2 text-sm text-text/50">No orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-6 w-full gap-0.5 overflow-hidden rounded-full">
        {STATUS_ORDER.map((status) => {
          const count = counts[status] ?? 0;
          if (count === 0) return null;
          const pct = (count / total) * 100;
          return (
            <div
              key={status}
              title={`${STATUS_META[status].label}: ${count} (${Math.round(pct)}%)`}
              className={`${STATUS_META[status].bar} h-full first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_META[status].dot}`} />
            <div className="text-xs">
              <p className="font-semibold text-text">{counts[status] ?? 0}</p>
              <p className="text-text/50">{STATUS_META[status].label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
