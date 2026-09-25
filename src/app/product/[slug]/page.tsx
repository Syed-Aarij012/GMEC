import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Truck, RotateCcw, Lock, CheckCircle2, XCircle, Check, Star } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { getProductImages } from "@/frontend/lib/product";
import { getKeyFeatures, getSpecRows, getApplications } from "@/backend/lib/productContent";
import ProductGallery from "@/frontend/components/product/ProductGallery";
import PriceTag from "@/frontend/components/product/PriceTag";
import AddToCartButton from "@/frontend/components/product/AddToCartButton";
import WishlistButton from "@/frontend/components/product/WishlistButton";
import ProductGrid from "@/frontend/components/product/ProductGrid";
import ProductAccordion from "@/frontend/components/product/ProductAccordion";
import ProductReviews from "@/frontend/components/product/ProductReviews";
import Reveal from "@/frontend/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Product", alternates: { canonical: `/product/${slug}` } };
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

  const [related, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id } },
      take: 4,
    }),
    prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const images = getProductImages(product.images);
  const quickSpecs = [product.fitting, product.wattage, product.colour].filter(Boolean) as string[];
  const keyFeatures = getKeyFeatures(product, product.category.name);
  const specRows = getSpecRows(product, product.category.name);
  const applications = getApplications(product.category.slug);

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

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

          {reviews.length > 0 && (
            <a href="#reviews" className="mt-1.5 flex items-center gap-1.5 text-sm">
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${n <= Math.round(avgRating) ? "fill-gold-500 text-gold-500" : "text-line/30"}`}
                  />
                ))}
              </span>
              <span className="text-text/60 hover:text-gold-600">
                {avgRating.toFixed(1)} ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </span>
            </a>
          )}

          {quickSpecs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {quickSpecs.map((spec) => (
                <span
                  key={spec}
                  className="rounded-full border border-line/15 bg-canvas-muted px-3 py-1 text-xs font-semibold text-text/70"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            {inStock ? (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                {lowStock ? `Only ${product.stock} left in stock` : "In stock"}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
                <XCircle className="h-4 w-4" />
                Out of stock
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-text/50">Inc. VAT</p>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-text/70">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm text-text/80">
            {keyFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

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

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-canvas-muted p-4 text-sm text-text/70 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-gold-600" /> Free UK delivery over £100 +VAT
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0 text-gold-600" /> 14-day returns, no quibble
            </p>
            <p className="flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0 text-gold-600" /> Secure, encrypted checkout
            </p>
          </div>

          <p className="mt-4 text-xs text-text/50">
            Sold and shipped by{" "}
            <Link href="https://www.gmeccorporation.com/" className="font-medium text-text/70 underline underline-offset-2 hover:text-gold-600">
              GMEC Corporation
            </Link>
            .
          </p>

        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <Reveal>
          <h2 className="mb-4 text-2xl font-extrabold text-text">Product Description</h2>
          <p className="whitespace-pre-line leading-relaxed text-text/70">{product.description}</p>
        </Reveal>

        <Reveal delay={0.05} className="mt-6">
          <ProductAccordion title={`Key Features — ${product.name}`} defaultOpen>
            <ul className="space-y-2 text-sm text-text/80">
              {keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </ProductAccordion>

          <ProductAccordion title={`${product.name} Specifications`}>
            <ul className="space-y-2 text-sm text-text/80">
              {specRows.map((s) => (
                <li key={s.label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>
                    <span className="font-semibold text-text">{s.label}:</span> {s.value}
                  </span>
                </li>
              ))}
            </ul>
          </ProductAccordion>

          <ProductAccordion title={`Ideal Applications for ${product.name}`}>
            <ul className="space-y-2 text-sm text-text/80">
              {applications.map((app) => (
                <li key={app} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </ProductAccordion>
        </Reveal>
      </div>

      <div id="reviews" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
        <Reveal>
          <ProductReviews productId={product.id} initialReviews={reviews} />
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
