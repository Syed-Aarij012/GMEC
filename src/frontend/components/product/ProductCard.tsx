import Link from "next/link";
import Image from "next/image";
import type { Product } from "@prisma/client";
import { getProductImages } from "@/frontend/lib/product";
import PriceTag from "./PriceTag";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = getProductImages(product.images)[0];
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line/5 bg-canvas shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-canvas-muted">
        {onSale && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-ink-950">
            SALE
          </span>
        )}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image}
          />
        </div>
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.fitting && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-600">
            {product.fitting} {product.wattage ? `· ${product.wattage}` : ""}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-text hover:text-gold-600">
          {product.name}
        </Link>
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
        <div className="mt-auto pt-2">
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
