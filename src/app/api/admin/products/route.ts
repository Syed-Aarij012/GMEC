import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { productSchema } from "@/backend/lib/validation";
import { placeholderImage } from "@/backend/lib/placeholder";

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  const images = data.images && data.images.length > 0 ? data.images : [placeholderImage(data.name)];

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        shortDescription: data.shortDescription?.trim() || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        fitting: data.fitting || null,
        wattage: data.wattage || null,
        colour: data.colour || null,
        stock: data.stock,
        featured: data.featured,
        images: JSON.stringify(images),
      },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "A product with this slug or SKU already exists" }, { status: 409 });
  }
}
