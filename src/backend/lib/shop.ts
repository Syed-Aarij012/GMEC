import { prisma } from "@/backend/lib/prisma";
import type { Prisma } from "@prisma/client";

export const PAGE_SIZE = 12;

export interface ShopSearchParams {
  q?: string;
  category?: string;
  fitting?: string;
  colour?: string;
  sort?: string;
  page?: string;
}

export async function getFilteredProducts(
  params: ShopSearchParams,
  forcedCategorySlug?: string
) {
  const where: Prisma.ProductWhereInput = {};

  const categorySlug = forcedCategorySlug ?? params.category;
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (params.fitting) {
    where.fitting = params.fitting;
  }
  if (params.colour) {
    where.colour = params.colour;
  }
  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
        ? { price: "desc" }
        : params.sort === "newest"
          ? { createdAt: "desc" }
          : { name: "asc" };

  const page = Math.max(1, Number(params.page) || 1);

  const [products, total, fittings, colours] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : {},
      distinct: ["fitting"],
      select: { fitting: true },
    }),
    prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : {},
      distinct: ["colour"],
      select: { colour: true },
    }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    availableFittings: fittings.map((f) => f.fitting).filter((f): f is string => Boolean(f)),
    availableColours: colours.map((c) => c.colour).filter((c): c is string => Boolean(c)),
  };
}
