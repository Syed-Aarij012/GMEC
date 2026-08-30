"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/frontend/lib/utils";

export default function ShopFilters({
  availableFittings,
}: {
  availableFittings: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeFitting = searchParams.get("fitting");
  const activeSort = searchParams.get("sort") ?? "name";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {availableFittings.length > 0 && (
          <>
            <FilterChip
              label="All Fittings"
              active={!activeFitting}
              onClick={() => updateParam("fitting", null)}
            />
            {availableFittings.map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={activeFitting === f}
                onClick={() => updateParam("fitting", f)}
              />
            ))}
          </>
        )}
      </div>

      <select
        value={activeSort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="shrink-0 rounded-full border border-line/10 bg-canvas px-4 py-2 text-sm font-medium text-text outline-none focus:border-gold-500"
      >
        <option value="name">Sort: A–Z</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
        active
          ? "border-gold-500 bg-gold-500 text-ink-950"
          : "border-line/15 text-text/70 hover:border-gold-500 hover:text-text"
      )}
    >
      {label}
    </button>
  );
}
