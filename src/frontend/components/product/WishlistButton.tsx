"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/frontend/store/wishlist";
import { useMounted } from "@/frontend/hooks/useMounted";

interface Props {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant?: "icon" | "full";
}

export default function WishlistButton({ productId, slug, name, price, image, variant = "icon" }: Props) {
  const mounted = useMounted();
  const inWishlist = useWishlistStore((s) => s.has(productId));
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ productId, slug, name, price, image });
  }

  const active = mounted && inWishlist;

  if (variant === "full") {
    return (
      <motion.button
        type="button"
        onClick={handleToggle}
        whileTap={{ scale: 0.95 }}
        suppressHydrationWarning
        aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
        className={`flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
          active
            ? "border-gold-500 bg-gold-500/10 text-gold-600"
            : "border-line/15 text-text hover:border-gold-500 hover:text-gold-600"
        }`}
      >
        <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
        {active ? "Saved" : "Add to Wishlist"}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileTap={{ scale: 0.85 }}
      suppressHydrationWarning
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas/90 text-text/60 shadow-sm backdrop-blur transition-colors hover:text-red-500"
    >
      <Heart className={`h-4 w-4 ${active ? "fill-red-500 text-red-500" : ""}`} />
    </motion.button>
  );
}
