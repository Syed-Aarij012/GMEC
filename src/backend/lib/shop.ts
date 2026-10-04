import { prisma } from "@/backend/lib/prisma";
import type { Prisma } from "@prisma/client";

export const PAGE_SIZE = 12;

interface VirtualCategory {
  colour?: string;
  /** Real Category slug to scope to, for a per-fitting split of an actual
   * shape category (e.g. candle bulbs) rather than a colour collection. */
  category?: string;
  fitting?: string;
}

// These "categories" are colour-temperature (and colour+fitting) collections
// on the real site, not a bulb shape — WooCommerce cross-lists every
// cool/warm white product there regardless of its shape category (frosted,
// filament, candle, etc.), and further splits each colour out per fitting
// (e.g. "Cool White E27 LED Bulbs") for its own dedicated SEO landing page.
// Our schema only stores one categoryId per product, but `colour` and
// `fitting` are independent attributes, so we reproduce the same
// cross-cutting listings by filtering on those instead of categoryId for
// just these slugs, which have no real Category row of their own.
export const VIRTUAL_CATEGORY_SLUGS: Record<string, VirtualCategory> = {
  "cool-white-led-bulbs": { colour: "Cool White" },
  "warm-white-led-bulbs": { colour: "Warm White" },
  "cool-white-e27-led-bulbs": { colour: "Cool White", fitting: "E27" },
  "cool-white-b22-led-bulbs": { colour: "Cool White", fitting: "B22" },
  "cool-white-e14-led-bulbs": { colour: "Cool White", fitting: "E14" },
  "cool-white-gu10-led-bulbs": { colour: "Cool White", fitting: "GU10" },
  "warm-white-e27-led-bulbs": { colour: "Warm White", fitting: "E27" },
  "candle-e14-led-bulbs": { category: "led-candle-bulbs", fitting: "E14" },
  "candle-b22-led-bulbs": { category: "led-candle-bulbs", fitting: "B22" },
  "filament-e27-led-bulbs": { category: "led-filament-bulbs", fitting: "E27" },
  "filament-e14-led-bulbs": { category: "led-filament-bulbs", fitting: "E14" },
  "filament-b22-led-bulbs": { category: "led-filament-bulbs", fitting: "B22" },
};

export interface FittingNav {
  /** Every fitting in this colour family that has its own dedicated page,
   * mapped to that page's URL (e.g. "E27" -> "/shop/cool-white-e27-led-bulbs"). */
  fittingPages: Record<string, string>;
  /** Set only when `slug` itself is a fitting-locked page, so its pill row
   * can offer a way back to the unfiltered colour page. */
  allFittingsHref?: string;
}

// Describes the fitting-navigation pills for any slug in a colour or
// category family (the parent page and each of its per-fitting pages), so
// every page in the family can show the same "All Fittings / E27 / B22 / …"
// row and link straight to a sibling page instead of just filtering in
// place. The parent can be a virtual colour page (cool-white-led-bulbs) or
// a real Category page (led-candle-bulbs) — both work the same way here.
// Returns null when `slug` has no fitting sub-pages at all, which keeps its
// existing query-string-only fitting filter untouched.
export function getFittingNav(slug: string): FittingNav | null {
  const entry = VIRTUAL_CATEGORY_SLUGS[slug];
  if (entry && (entry.colour || entry.category)) {
    const fittingPages: Record<string, string> = {};
    // A category-based family (e.g. candle bulbs) has a real page of its
    // own to fall back to; a colour-based family's "parent" is itself
    // virtual and found in the loop below.
    let parentSlug: string | undefined = entry.category;
    for (const [candidateSlug, candidate] of Object.entries(VIRTUAL_CATEGORY_SLUGS)) {
      const sameFamily = entry.colour ? candidate.colour === entry.colour : candidate.category === entry.category;
      if (!sameFamily) continue;
      if (candidate.fitting) fittingPages[candidate.fitting] = `/shop/${candidateSlug}`;
      else parentSlug = candidateSlug;
    }
    return {
      fittingPages,
      allFittingsHref: entry.fitting && parentSlug ? `/shop/${parentSlug}` : undefined,
    };
  }

  // `slug` isn't virtual itself — check whether it's a real Category that
  // one or more virtual fitting pages point back to (e.g. led-candle-bulbs
  // is the real parent of candle-e14-led-bulbs and candle-b22-led-bulbs).
  const fittingPages: Record<string, string> = {};
  for (const [candidateSlug, candidate] of Object.entries(VIRTUAL_CATEGORY_SLUGS)) {
    if (candidate.category === slug && candidate.fitting) {
      fittingPages[candidate.fitting] = `/shop/${candidateSlug}`;
    }
  }
  return Object.keys(fittingPages).length > 0 ? { fittingPages } : null;
}

export interface ShopSearchParams {
  q?: string;
  category?: string;
  fitting?: string;
  colour?: string;
  sort?: string;
  page?: string;
}

// Self-referencing canonical for a listing page: includes only the params that
// actually change the result set, sorted for a stable URL, and drops page=1
// since that's the same content as no page param at all.
export function buildShopCanonical(basePath: string, params: ShopSearchParams): string {
  const entries = Object.entries(params)
    .filter(([key, value]) => value && !(key === "page" && value === "1"))
    .sort(([a], [b]) => a.localeCompare(b)) as [string, string][];
  if (entries.length === 0) return basePath;
  return `${basePath}?${new URLSearchParams(entries).toString()}`;
}

export async function getFilteredProducts(
  params: ShopSearchParams,
  forcedCategorySlug?: string
) {
  const where: Prisma.ProductWhereInput = {};

  const categorySlug = forcedCategorySlug ?? params.category;
  const virtual = categorySlug ? VIRTUAL_CATEGORY_SLUGS[categorySlug] : undefined;
  if (virtual) {
    if (virtual.colour) where.colour = virtual.colour;
    if (virtual.category) where.category = { slug: virtual.category };
    if (virtual.fitting) where.fitting = virtual.fitting;
  } else if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  // A locked fitting from the slug itself (e.g. /cool-white-e27-led-bulbs)
  // takes precedence over a stray ?fitting= query param, so the dedicated
  // per-fitting SEO page can't be filtered into showing a different fitting.
  if (params.fitting && !virtual?.fitting) {
    where.fitting = params.fitting;
  }
  if (params.colour) {
    where.colour = params.colour;
  }
  const keywords = params.q?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (keywords.length > 0) {
    where.AND = keywords.map((word) => ({
      OR: [
        { name: { contains: word, mode: "insensitive" } },
        { description: { contains: word, mode: "insensitive" } },
      ],
    }));
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
        ? { price: "desc" }
        : params.sort === "newest"
          ? { createdAt: "desc" }
          : { name: "asc" };

  const page = Math.max(1, Number(params.page) || 1);

  const categoryScope: Prisma.ProductWhereInput = virtual
    ? {
        ...(virtual.colour ? { colour: virtual.colour } : {}),
        ...(virtual.category ? { category: { slug: virtual.category } } : {}),
        ...(virtual.fitting ? { fitting: virtual.fitting } : {}),
      }
    : categorySlug
      ? { category: { slug: categorySlug } }
      : {};

  const [products, total, fittings, colours] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: categoryScope,
      distinct: ["fitting"],
      select: { fitting: true },
    }),
    prisma.product.findMany({
      where: categoryScope,
      distinct: ["colour"],
      select: { colour: true },
    }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    availableFittings: fittings.map((f) => f.fitting).filter((f): f is string => Boolean(f)),
    availableColours: colours.map((c) => c.colour).filter((c): c is string => Boolean(c)),
  };
}
