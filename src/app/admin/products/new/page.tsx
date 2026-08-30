import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import ProductForm from "@/frontend/components/admin/ProductForm";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Reveal className="mb-6">
        <Link
          href="/admin/products"
          className="mb-2 flex w-fit items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to products
        </Link>
        <h1 className="text-2xl font-extrabold text-text">Add Product</h1>
      </Reveal>
      <ProductForm categories={categories} />
    </div>
  );
}
