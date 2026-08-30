"use client";

import Link from "next/link";
import { HardHat, Building2, Hotel } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { staggerItem } from "@/frontend/components/motion/StaggerGrid";

const sectors = [
  {
    icon: HardHat,
    title: "Electrical Contractors",
    desc: "Trade pricing and bulk availability on fittings, downlights and bulbs for every job.",
  },
  {
    icon: Building2,
    title: "Property Developers",
    desc: "Reliable stock and consistent quality for new-build and refurbishment projects.",
  },
  {
    icon: Hotel,
    title: "Hotels & Hospitality",
    desc: "Ambient and fire-rated lighting solutions built to run around the clock.",
  },
];

export default function SectorsServed() {
  return (
    <section className="bg-ink-900">
      <div className="container-page py-16">
        <Reveal className="mb-10 max-w-xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Who We Serve</h2>
          <p className="mt-2 text-cream-100/70">
            Alongside everyday homeowners, we work with businesses that need
            lighting they can depend on.
          </p>
        </Reveal>
        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {sectors.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-ink-950">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-cream-100/70">{desc}</p>
            </motion.div>
          ))}
        </StaggerGrid>
        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-105 hover:bg-gold-400"
          >
            Enquire About a Trade Account
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
