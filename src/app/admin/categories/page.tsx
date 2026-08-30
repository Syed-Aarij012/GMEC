import { FolderTree } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import CategoryForm from "@/frontend/components/admin/CategoryForm";
import DeleteButton from "@/frontend/components/admin/DeleteButton";
import Reveal from "@/frontend/components/motion/Reveal";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <Reveal>
        <h1 className="text-2xl font-extrabold text-text">Categories</h1>
        <p className="mt-1 text-sm text-text/50">{categories.length} categories</p>
      </Reveal>

      <Reveal delay={0.05}>
        <CategoryForm />
      </Reveal>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <FolderTree className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">No categories yet, add one above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <AnimatedTableBody>
                {categories.map((c) => (
                  <AnimatedTableRow key={c.id}>
                    <td className="px-4 py-3 font-medium text-text">{c.name}</td>
                    <td className="px-4 py-3 text-text/60">{c.slug}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-canvas-muted px-2.5 py-1 text-xs font-medium text-text/70">
                        {c._count.products} {c._count.products === 1 ? "product" : "products"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <DeleteButton url={`/api/admin/categories/${c.id}`} confirmText={`Delete "${c.name}"?`} />
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
