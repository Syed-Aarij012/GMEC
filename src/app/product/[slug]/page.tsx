import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, ShieldCheck } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { getProductImages } from "@/frontend/lib/product";
import ProductGallery from "@/frontend/components/product/ProductGallery";
import PriceTag from "@/frontend/components/product/PriceTag";
import AddToCartButton from "@/frontend/components/product/AddToCartButton";
import WishlistButton from "@/frontend/components/product/WishlistButton";
import ProductGrid from "@/frontend/components/product/ProductGrid";
import Reveal from "@/frontend/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
  });

  const images = getProductImages(product.images);
  const specs = [
    product.fitting && { label: "Fitting", value: product.fitting },
    product.wattage && { label: "Wattage", value: product.wattage },
    product.colour && { label: "Colour / Finish", value: product.colour },
    { label: "SKU", value: product.sku },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-text/50">
        <Link href="/shop" className="hover:text-gold-600">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/shop/${product.category.slug}`} className="hover:text-gold-600">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Reveal>
          <ProductGallery images={images} name={product.name} />
        </Reveal>

        <Reveal delay={0.1}>
          {product.fitting && (
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-extrabold text-text">{product.name}</h1>

          <div className="mt-4">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            <p className="mt-1 text-xs text-text/50">Inc. VAT</p>
          </div>

          <p className="mt-6 leading-relaxed text-text/70">{product.description}</p>

          {specs.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-line/10 p-4 text-sm sm:grid-cols-4">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-text/50">{s.label}</dt>
                  <dd className="font-semibold text-text">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={images[0]}
              stock={product.stock}
              showQuantityPicker
            />
            <WishlistButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={images[0]}
              variant="full"
            />
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-canvas-muted p-4 text-sm text-text/70">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold-600" /> Free UK delivery on orders over £100 +VAT
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold-600" /> 14-day returns, no quibble
            </p>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <h2 className="mb-6 text-2xl font-extrabold text-text">You may also like</h2>
          </Reveal>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
