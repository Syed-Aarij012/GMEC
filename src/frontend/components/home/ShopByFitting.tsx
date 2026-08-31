"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { staggerItem } from "@/frontend/components/motion/StaggerGrid";

export interface FittingCard {
  fitting: string;
  image: string;
}

export default function ShopByFitting({ fittings }: { fittings: FittingCard[] }) {
  return (
    <section className="bg-canvas">
      <div className="container-page py-14">
        <Reveal className="mb-8 overflow-hidden rounded-2xl bg-ink-900">
          <h2 className="px-6 py-5 text-xl font-extrabold uppercase tracking-wide text-gold-400 sm:text-2xl">
            Shop by Fitting
          </h2>
        </Reveal>
        <StaggerGrid className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {fittings.map((f) => (
            <motion.div key={f.fitting} variants={staggerItem}>
              <Link href={`/shop?fitting=${encodeURIComponent(f.fitting)}`} className="group block">
                <div className="rounded-xl bg-gold-500 px-4 py-3 text-center text-lg font-extrabold text-ink-950">
                  {f.fitting}
                </div>
                <div className="relative mt-5 aspect-square">
                  <Image
                    src={f.image}
                    alt={`${f.fitting} fitting bulbs`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
