"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useWishlistStore } from "@/frontend/store/wishlist";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/frontend/lib/utils";
import { useMounted } from "@/frontend/hooks/useMounted";

export default function WishlistPage() {
  const mounted = useMounted();

  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <Heart className="h-14 w-14 text-text/20" />
        <h1 className="mt-4 text-2xl font-extrabold text-text">Your wishlist is empty</h1>
        <p className="mt-2 text-text/60">Save items you love and find them here later.</p>
        <Link
          href="/shop"
          className="mt-6 rounded-full bg-ink-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="mb-2 text-3xl font-extrabold text-text">Your Wishlist</h1>
      <p className="mb-8 text-text/60">{items.length} saved item{items.length === 1 ? "" : "s"}</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm"
            >
              <Link href={`/product/${item.slug}`} className="relative block aspect-square bg-canvas-muted">
                <Image src={item.image} alt={item.name} fill unoptimized sizes="25vw" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-text hover:text-gold-600">
                  {item.name}
                </Link>
                <p className="font-bold text-text">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <button
                    onClick={() =>
                      addToCart({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gold-600 hover:text-ink-950"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove from wishlist"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text/40 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
