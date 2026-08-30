"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";

interface Props {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  showQuantityPicker?: boolean;
}

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  stock,
  showQuantityPicker = false,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (stock <= 0) return;
    addItem({ productId, slug, name, price, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (stock <= 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-ink-900/10 px-5 py-2.5 text-sm font-semibold text-text/40"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {showQuantityPicker && (
        <div className="flex items-center rounded-full border border-line/10">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2.5 text-text hover:text-gold-600"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="p-2.5 text-text hover:text-gold-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
      <motion.button
        type="button"
        onClick={handleAdd}
        whileTap={{ scale: 0.95 }}
        animate={added ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        suppressHydrationWarning
        className={`flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
          added ? "bg-gold-500 text-ink-950" : "bg-ink-900 text-white hover:bg-gold-600 hover:text-ink-950"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" /> Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Basket
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
