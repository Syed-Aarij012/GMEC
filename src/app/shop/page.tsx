import type { Metadata } from "next";
import { prisma } from "@/backend/lib/prisma";
import { getFilteredProducts, type ShopSearchParams } from "@/backend/lib/shop";
import CategorySidebar from "@/frontend/components/shop/CategorySidebar";
import ShopFilters from "@/frontend/components/shop/ShopFilters";
import ProductGrid from "@/frontend/components/product/ProductGrid";
import Pagination from "@/frontend/components/shop/Pagination";
import Reveal from "@/frontend/components/motion/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LED Bulbs, Downlights & Smart Home Products UK | GMEC Shop",
  description:
    "Shop GU10, E14, B22 & E27 LED bulbs, fire-rated downlights, smart smoke detectors & more. Energy-efficient lighting with free UK delivery over £100.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const [categories, { products, total, page, totalPages, availableFittings }] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      getFilteredProducts(params),
    ]);

  function buildHref(p: number) {
    const usp = new URLSearchParams(params as Record<string, string>);
    usp.set("page", String(p));
    return `/shop?${usp.toString()}`;
  }

  return (
    <div className="container-page py-10">
      <Reveal className="mb-8">
        <h1 className="text-3xl font-extrabold text-text">
          {params.q ? `Search results for "${params.q}"` : "Shop"}
        </h1>
        {!params.q && (
          <p className="mt-3 max-w-none text-text/60">
            Browse GMEC&apos;s full range of energy-efficient LED bulbs and lighting solutions for
            homes, offices, and commercial spaces across the UK. Choose from GU10, E14, B22, and
            E27 fittings in a range of wattages (4W–96W) and colour temperatures, including warm
            white and cool white. Every product is built for reliable performance, low energy
            consumption, and long-lasting illumination, with free UK delivery on orders over £100
            +VAT.
          </p>
        )}
        <p className="mt-3 text-text/60">{total} products</p>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <CategorySidebar categories={categories} />
        <div>
          <ShopFilters availableFittings={availableFittings} />
          <div className="mt-6">
            <ProductGrid products={products} />
          </div>
          <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
        </div>
      </div>
    </div>
  );
}
