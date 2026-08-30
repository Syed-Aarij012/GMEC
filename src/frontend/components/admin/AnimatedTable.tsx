"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export function AnimatedTableBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.tbody
      initial="hidden"
      animate="show"
      variants={container}
      className="divide-y divide-line/5"
    >
      {children}
    </motion.tbody>
  );
}

export function AnimatedTableRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.tr variants={row} className="transition-colors hover:bg-canvas-muted">
      {children}
    </motion.tr>
  );
}
