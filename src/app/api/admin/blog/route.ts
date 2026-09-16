import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";
import { blogPostSchema } from "@/backend/lib/validation";

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        author: data.author || "GMEC Team",
        published: data.published,
      },
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
  }
}
