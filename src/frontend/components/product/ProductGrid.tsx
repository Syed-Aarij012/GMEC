"use client";

import type { Product } from "@prisma/client";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import StaggerGrid, { staggerItem } from "@/frontend/components/motion/StaggerGrid";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line/15 py-16 text-center text-text/60">
        No products found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <motion.div key={product.id} variants={staggerItem}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </StaggerGrid>
  );
}
