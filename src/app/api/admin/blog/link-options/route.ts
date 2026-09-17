import { NextResponse } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { getAdminSession } from "@/backend/lib/admin";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const [categories, posts] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.blogPost.findMany({ select: { slug: true, title: true }, orderBy: { title: "asc" } }),
  ]);

  const options = [
    { label: "Home", url: "/" },
    { label: "Shop (all products)", url: "/shop" },
    { label: "Contact", url: "/contact" },
    { label: "Blog (all posts)", url: "/blog" },
    ...categories.map((c) => ({ label: `Shop: ${c.name}`, url: `/shop/${c.slug}` })),
    ...posts.map((p) => ({ label: `Blog: ${p.title}`, url: `/blog/${p.slug}` })),
  ];

  return NextResponse.json({ options });
}
