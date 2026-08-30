import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category } from "@prisma/client";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-80"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
      <div className="relative mt-auto flex w-full items-center justify-between p-5">
        <span className="text-lg font-bold text-white">{category.name}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-ink-950 transition group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
