import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { reviewSchema } from "@/backend/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const review = await prisma.review.create({ data: parsed.data });

  return NextResponse.json({ review });
}
