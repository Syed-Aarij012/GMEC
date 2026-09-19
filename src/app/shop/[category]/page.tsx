import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/backend/lib/prisma";
import { getFilteredProducts, buildShopCanonical, type ShopSearchParams } from "@/backend/lib/shop";
import { categorySeo } from "@/backend/lib/categorySeo";
import CategorySidebar from "@/frontend/components/shop/CategorySidebar";
import ShopFilters from "@/frontend/components/shop/ShopFilters";
import ProductGrid from "@/frontend/components/product/ProductGrid";
import Pagination from "@/frontend/components/shop/Pagination";
import Reveal from "@/frontend/components/motion/Reveal";
import CategoryContent from "@/frontend/components/shop/CategoryContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<ShopSearchParams>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const sp = await searchParams;
  const canonical = buildShopCanonical(`/shop/${slug}`, sp);
  const seo = categorySeo[slug];
  if (seo) return { title: seo.title, description: seo.description, alternates: { canonical } };
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.name ?? "Shop", alternates: { canonical } };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<ShopSearchParams>;
}) {
  const { category: slug } = await params;
  const sp = await searchParams;

  const [categories, category] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findUnique({ where: { slug } }),
  ]);

  if (!category) notFound();

  const seo = categorySeo[slug];
  const h1 = seo?.h1 ?? category.name;
  const intro = seo?.intro ?? category.description;

  const { products, total, page, totalPages, availableFittings } =
    await getFilteredProducts(sp, slug);

  function buildHref(p: number) {
    const usp = new URLSearchParams(sp as Record<string, string>);
    usp.set("page", String(p));
    return `/shop/${slug}?${usp.toString()}`;
  }

  return (
    <div className="container-page py-10">
      <Reveal className="mb-8">
        <h1 className="text-3xl font-extrabold text-text">{h1}</h1>
        {intro && <p className="mt-3 text-text/60">{intro}</p>}
        <p className="mt-1 text-sm text-text/50">{total} products</p>
        <p className="mt-1 text-xs text-text/50">
          Curated and supplied by{" "}
          <Link href="https://www.gmeccorporation.com/" className="font-medium text-text/70 underline underline-offset-2 hover:text-gold-600">
            GMEC Corporation
          </Link>
          .
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <CategorySidebar categories={categories} activeSlug={slug} />
        <div>
          <ShopFilters availableFittings={availableFittings} />
          <div className="mt-6">
            <ProductGrid products={products} />
          </div>
          <Pagination currentPage={page} totalPages={totalPages} buildHref={buildHref} />
          {seo?.content && <CategoryContent sections={seo.content} />}
        </div>
      </div>
    </div>
  );
}
