"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="mx-auto flex h-16 w-16 items-center justify-center"
    >
      <CheckCircle2 className="h-16 w-16 text-gold-500" />
    </motion.div>
  );
}
