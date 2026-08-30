import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@prisma/client";
import ProductGrid from "@/frontend/components/product/ProductGrid";
import Reveal from "@/frontend/components/motion/Reveal";

export default function ProductShowcase({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="bg-canvas">
      <div className="container-page py-14">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-text/60">{subtitle}</p>}
          </div>
          <Link
            href={viewAllHref}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold-600 transition-transform hover:translate-x-1 hover:text-gold-700 sm:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
