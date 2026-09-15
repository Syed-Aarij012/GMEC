"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/frontend/lib/utils";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-canvas-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="scrollbar-none mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <motion.button
              key={img + i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-lg bg-canvas-muted ring-2 transition-shadow",
                active === i ? "ring-gold-500" : "ring-transparent"
              )}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill unoptimized sizes="56px" className="object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
