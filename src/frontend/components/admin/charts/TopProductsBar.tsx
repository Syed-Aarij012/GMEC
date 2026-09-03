import { Trophy } from "lucide-react";
import { formatPrice } from "@/frontend/lib/utils";

export interface TopProduct {
  name: string;
  revenue: number;
}

export default function TopProductsBar({ data }: { data: TopProduct[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-line/15 text-center">
        <Trophy className="h-8 w-8 text-text/20" />
        <p className="mt-2 text-sm text-text/50">No sales yet.</p>
      </div>
    );
  }

  const max = Math.max(...data.map((p) => p.revenue));

  return (
    <ul className="space-y-3">
      {data.map((product) => (
        <li key={product.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm">
          <div>
            <p className="truncate font-medium text-text">{product.name}</p>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-canvas-muted">
              <div
                className="h-full rounded-r-full bg-gold-500"
                style={{ width: `${max > 0 ? (product.revenue / max) * 100 : 0}%` }}
              />
            </div>
          </div>
          <span className="whitespace-nowrap font-semibold text-text">{formatPrice(product.revenue)}</span>
        </li>
      ))}
    </ul>
  );
}
