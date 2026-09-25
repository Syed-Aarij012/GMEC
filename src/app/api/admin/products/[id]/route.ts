import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { productSchema } from "@/backend/lib/validation";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const updateData: Record<string, unknown> = {
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
      images: JSON.stringify(data.images ?? []),
    };

    const product = await prisma.product.update({ where: { id }, data: updateData });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Could not update product" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete product" }, { status: 400 });
  }
}
