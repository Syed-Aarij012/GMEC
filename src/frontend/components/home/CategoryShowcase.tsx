"use client";

import type { Category } from "@prisma/client";
import { motion } from "framer-motion";
import CategoryCard from "@/frontend/components/category/CategoryCard";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { staggerItem } from "@/frontend/components/motion/StaggerGrid";

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-canvas-soft">
      <div className="container-page py-14">
        <Reveal className="mb-8">
          <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Shop by Category</h2>
          <p className="mt-1 text-text/60">Find exactly what your project needs.</p>
        </Reveal>
        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <motion.div key={c.id} variants={staggerItem}>
              <CategoryCard category={c} />
            </motion.div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
