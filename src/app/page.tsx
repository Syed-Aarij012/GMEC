import { prisma } from "@/backend/lib/prisma";
import Hero from "@/frontend/components/home/Hero";
import TrustBadges from "@/frontend/components/home/TrustBadges";
import CategoryShowcase from "@/frontend/components/home/CategoryShowcase";
import ProductShowcase from "@/frontend/components/home/ProductShowcase";
import SectorsServed from "@/frontend/components/home/SectorsServed";
import Newsletter from "@/frontend/components/home/Newsletter";

export default async function Home() {
  const [categories, featured, newArrivals] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ where: { featured: true }, take: 8 }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <CategoryShowcase categories={categories} />
      <ProductShowcase
        title="Trending Now"
        subtitle="Our most popular lighting and smart home picks."
        products={featured}
        viewAllHref="/shop"
      />
      <SectorsServed />
      <ProductShowcase
        title="New Arrivals"
        subtitle="Fresh additions to the GMEC range."
        products={newArrivals}
        viewAllHref="/shop"
      />
      <Newsletter />
    </>
  );
}
