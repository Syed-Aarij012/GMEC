import Link from "next/link";
import type { Category } from "@prisma/client";
import { cn } from "@/frontend/lib/utils";

export default function CategorySidebar({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <nav className="rounded-2xl border border-line/10 p-4">
      <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-text/50">
        Categories
      </h3>
      <ul className="space-y-1">
        <li>
          <Link
            href="/shop"
            className={cn(
              "block rounded-lg px-2.5 py-2 text-sm font-medium",
              !activeSlug ? "bg-ink-900 text-white" : "text-text hover:bg-canvas-muted"
            )}
          >
            All Products
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/shop/${c.slug}`}
              className={cn(
                "block rounded-lg px-2.5 py-2 text-sm font-medium",
                activeSlug === c.slug
                  ? "bg-ink-900 text-white"
                  : "text-text hover:bg-canvas-muted"
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
