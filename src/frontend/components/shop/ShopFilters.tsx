"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/frontend/lib/utils";

export default function ShopFilters({
  availableFittings,
  fittingPages = {},
  allFittingsHref,
  lockedFitting,
}: {
  availableFittings: string[];
  /** Maps a fitting value to a dedicated SEO page for it, when one exists
   * (e.g. "E27" -> "/shop/cool-white-e27-led-bulbs"). Clicking that fitting's
   * chip navigates there instead of just setting ?fitting= on this page. */
  fittingPages?: Record<string, string>;
  /** When this page is itself a fitting-locked page, "All Fittings" links
   * back to the unfiltered colour page instead of clearing a query param
   * this page doesn't use. */
  allFittingsHref?: string;
  /** The fitting this page is locked to via its URL (not a query param),
   * so it can be shown as the active chip. */
  lockedFitting?: string;
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

  const activeFitting = lockedFitting ?? searchParams.get("fitting");
  const activeSort = searchParams.get("sort") ?? "name";

  function selectFitting(f: string) {
    const dedicatedPage = fittingPages[f];
    if (dedicatedPage) {
      router.push(dedicatedPage);
      return;
    }
    updateParam("fitting", f);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {availableFittings.length > 0 && (
          <>
            <FilterChip
              label="All Fittings"
              active={!activeFitting}
              onClick={() => (allFittingsHref ? router.push(allFittingsHref) : updateParam("fitting", null))}
            />
            {availableFittings.map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={activeFitting === f}
                onClick={() => selectFitting(f)}
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
