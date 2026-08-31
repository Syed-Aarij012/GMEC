import { prisma } from "@/backend/lib/prisma";
import Hero from "@/frontend/components/home/Hero";
import TrustBadges from "@/frontend/components/home/TrustBadges";
import ShopByFitting from "@/frontend/components/home/ShopByFitting";
import ProductShowcase from "@/frontend/components/home/ProductShowcase";
import SectorsServed from "@/frontend/components/home/SectorsServed";
import Newsletter from "@/frontend/components/home/Newsletter";

const FITTINGS = [
  { fitting: "GU10", image: "/fittings/gu10.png" },
  { fitting: "E14", image: "/fittings/e14.png" },
  { fitting: "B22", image: "/fittings/b22.png" },
  { fitting: "E27", image: "/fittings/e27.png" },
];

export default async function Home() {
  const [featured, newArrivals] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, take: 8 }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <ShopByFitting fittings={FITTINGS} />
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
