import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, PackageSearch } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { formatPrice } from "@/frontend/lib/utils";
import { getProductImages } from "@/frontend/lib/product";
import DeleteButton from "@/frontend/components/admin/DeleteButton";
import Reveal from "@/frontend/components/motion/Reveal";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Reveal className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Products</h1>
          <p className="mt-1 text-sm text-text/50">{products.length} products in your catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </Reveal>

      {products.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <PackageSearch className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <AnimatedTableBody>
                {products.map((product) => (
                  <AnimatedTableRow key={product.id}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-canvas-muted ring-1 ring-line/10">
                        <Image src={getProductImages(product.images)[0]} alt={product.name} fill sizes="44px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-text">{product.name}</p>
                        <p className="text-xs text-text/40">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-canvas-muted px-2.5 py-1 text-xs font-medium text-text/70">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text/40 transition-colors hover:bg-canvas-muted hover:text-text"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          url={`/api/admin/products/${product.id}`}
                          confirmText={`Delete "${product.name}"?`}
                        />
                      </div>
                    </td>
                  </AnimatedTableRow>
                ))}
              </AnimatedTableBody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
        Out of stock
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="rounded-full bg-gold-500/15 px-2.5 py-1 text-xs font-semibold text-gold-700 dark:text-gold-400">
        {stock} left
      </span>
    );
  }
  return <span className="text-text/60">{stock}</span>;
}
