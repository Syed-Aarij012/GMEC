import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import ProductForm from "@/frontend/components/admin/ProductForm";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({ where: { id } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Reveal className="mb-6">
        <Link
          href="/admin/products"
          className="mb-2 flex w-fit items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to products
        </Link>
        <h1 className="text-2xl font-extrabold text-text">Edit Product</h1>
        <p className="mt-1 text-sm text-text/50">{product.name}</p>
      </Reveal>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
