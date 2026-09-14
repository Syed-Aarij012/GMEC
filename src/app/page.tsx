import type { Metadata } from "next";
import { prisma } from "@/backend/lib/prisma";
import Hero from "@/frontend/components/home/Hero";
import TrustBadges from "@/frontend/components/home/TrustBadges";
import ShopByFitting from "@/frontend/components/home/ShopByFitting";
import ProductShowcase from "@/frontend/components/home/ProductShowcase";
import SectorsServed from "@/frontend/components/home/SectorsServed";
import Newsletter from "@/frontend/components/home/Newsletter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FITTINGS = [
  { fitting: "GU10", image: "/fittings/gu10.png" },
  { fitting: "E14", image: "/fittings/e14.png" },
  { fitting: "B22", image: "/fittings/b22.png" },
  { fitting: "E27", image: "/fittings/e27.png" },
];

// One product per category (rather than a flat "featured" query) so Trending
// Now stays visually varied instead of surfacing several near-identical
// variants of the same fixture (e.g. the 2-pin/4-pin 2D fluorescent tubes,
// which were all flagged "featured" together in the old WooCommerce data).
const TRENDING_CATEGORY_SLUGS = [
  "led-frosted-bulbs",
  "led-filament-bulbs",
  "led-candle-bulbs",
  "led-ceiling-lights",
  "led-3-colours-in-1",
  "cool-white-led-bulbs",
  "warm-white-led-bulbs",
  "gu10-downlights",
];

export default async function Home() {
  const [trendingByCategory, newArrivals, gadgets] = await Promise.all([
    Promise.all(
      TRENDING_CATEGORY_SLUGS.map((slug) =>
        prisma.product.findFirst({
          where: { category: { slug } },
          orderBy: [{ featured: "desc" }, { name: "asc" }],
        })
      )
    ),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.product.findMany({
      where: { category: { slug: "smart-gadgets" } },
      take: 6,
    }),
  ]);

  const trending = trendingByCategory.filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <>
      <Hero />
      <TrustBadges />
      <ShopByFitting fittings={FITTINGS} />
      <ProductShowcase
        title="Trending Now"
        subtitle="Our most popular lighting and smart home picks."
        products={trending}
        viewAllHref="/shop"
      />
      <ProductShowcase
        title="Smart Scales | Alarms | Gadgets"
        subtitle="Beyond lighting — smart devices for everyday home life."
        products={gadgets}
        viewAllHref="/shop/smart-gadgets"
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
