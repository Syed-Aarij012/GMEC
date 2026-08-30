"use client";

import { Truck, RotateCcw, Headphones, Lock } from "lucide-react";
import { motion } from "framer-motion";
import StaggerGrid, { staggerItem } from "@/frontend/components/motion/StaggerGrid";

const badges = [
  { icon: Truck, title: "Free UK Delivery", desc: "On orders over £100 +VAT" },
  { icon: RotateCcw, title: "14-Day Returns", desc: "Simple, hassle-free process" },
  { icon: Headphones, title: "24/7 Support", desc: "Real people, real help" },
  { icon: Lock, title: "Secure Payments", desc: "Encrypted checkout" },
];

export default function TrustBadges() {
  return (
    <section className="border-b border-line/5 bg-canvas">
      <StaggerGrid className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
        {badges.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} variants={staggerItem} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas-muted text-gold-600">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-text">{title}</p>
              <p className="text-xs text-text/60">{desc}</p>
            </div>
          </motion.div>
        ))}
      </StaggerGrid>
    </section>
  );
}
