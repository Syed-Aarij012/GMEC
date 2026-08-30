import Link from "next/link";
import { cn } from "@/frontend/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex justify-center gap-2">
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
            p === currentPage
              ? "bg-ink-900 text-white"
              : "text-text hover:bg-canvas-muted"
          )}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}
