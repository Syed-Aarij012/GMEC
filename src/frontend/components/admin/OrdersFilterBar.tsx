"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Download, X } from "lucide-react";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export default function OrdersFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const status = searchParams.get("status") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const hasFilters = Boolean(status || from || to || searchParams.get("q"));

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: q.trim() || null });
  }

  function clearFilters() {
    setQ("");
    router.push(pathname);
  }

  const exportHref = `/api/admin/orders/export?${searchParams.toString()}`;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/30" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search customer, email, order ref…"
          className="w-64 rounded-full border border-line/15 bg-canvas py-2 pl-9 pr-3 text-sm outline-none focus:border-gold-500"
        />
      </form>

      <select
        value={status}
        onChange={(e) => updateParams({ status: e.target.value || null })}
        className="rounded-full border border-line/15 bg-canvas px-3.5 py-2 text-sm font-medium text-text outline-none focus:border-gold-500"
      >
        <option value="">Paid & Fulfilled (default)</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1.5 text-sm text-text/50">
        <input
          type="date"
          value={from}
          onChange={(e) => updateParams({ from: e.target.value || null })}
          className="rounded-full border border-line/15 bg-canvas px-3 py-2 text-sm text-text outline-none focus:border-gold-500"
        />
        <span>–</span>
        <input
          type="date"
          value={to}
          onChange={(e) => updateParams({ to: e.target.value || null })}
          className="rounded-full border border-line/15 bg-canvas px-3 py-2 text-sm text-text outline-none focus:border-gold-500"
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm font-medium text-text/50 hover:text-text"
        >
          <X className="h-3.5 w-3.5" /> Clear
        </button>
      )}

      <a
        href={exportHref}
        className="ml-auto flex items-center gap-1.5 rounded-full border border-line/15 px-3.5 py-2 text-sm font-semibold text-text hover:border-gold-500 hover:text-gold-600"
      >
        <Download className="h-3.5 w-3.5" /> Export CSV
      </a>
    </div>
  );
}
