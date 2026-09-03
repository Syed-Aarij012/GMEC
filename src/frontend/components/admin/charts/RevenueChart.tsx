"use client";

import { useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { formatPrice } from "@/frontend/lib/utils";

export interface RevenuePoint {
  date: string; // ISO yyyy-mm-dd
  revenue: number;
}

const VIEW_W = 100;
const VIEW_H = 40;
const BASELINE_Y = 38;
const TOP_PAD = 3;

function formatShortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const max = Math.max(...data.map((d) => d.revenue), 0);
  const hasRevenue = max > 0;
  const n = data.length;

  const xAt = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * VIEW_W);
  const yAt = (value: number) =>
    hasRevenue ? BASELINE_Y - (value / max) * (BASELINE_Y - TOP_PAD) : BASELINE_Y;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(d.revenue)}`).join(" ");
  const areaPath = `${linePath} L${xAt(n - 1)},${BASELINE_Y} L${xAt(0)},${BASELINE_Y} Z`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIndex(Math.round(ratio * (n - 1)));
  }

  if (!hasRevenue) {
    return (
      <div className="flex h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-line/15 text-center">
        <TrendingUp className="h-8 w-8 text-text/20" />
        <p className="mt-2 text-sm text-text/50">No revenue in this period yet.</p>
      </div>
    );
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div>
      <div ref={wrapperRef} className="relative h-[180px] w-full">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <line
            x1={0}
            y1={BASELINE_Y}
            x2={VIEW_W}
            y2={BASELINE_Y}
            className="text-line/15"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <path d={areaPath} className="fill-gold-500/10" stroke="none" />
          <path
            d={linePath}
            className="text-gold-500"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Endpoint marker */}
        <div
          className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 ring-2 ring-canvas"
          style={{ left: `${xAt(n - 1)}%`, top: `${(yAt(data[n - 1].revenue) / VIEW_H) * 100}%` }}
        />

        {hovered && hoverIndex !== null && (
          <>
            <div
              className="pointer-events-none absolute top-0 h-full w-px -translate-x-1/2 bg-text/15"
              style={{ left: `${xAt(hoverIndex)}%` }}
            />
            <div
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 ring-2 ring-canvas"
              style={{ left: `${xAt(hoverIndex)}%`, top: `${(yAt(hovered.revenue) / VIEW_H) * 100}%` }}
            />
            <div
              className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line/10 bg-canvas px-2.5 py-1.5 text-xs shadow-md"
              style={{
                left: `${Math.min(88, Math.max(12, xAt(hoverIndex)))}%`,
              }}
            >
              <p className="font-semibold text-text">{formatPrice(hovered.revenue)}</p>
              <p className="text-text/50">{formatShortDate(hovered.date)}</p>
            </div>
          </>
        )}

        <div
          className="absolute inset-0"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-text/40">
        <span>{formatShortDate(data[0].date)}</span>
        <span>{formatShortDate(data[n - 1].date)}</span>
      </div>
    </div>
  );
}
