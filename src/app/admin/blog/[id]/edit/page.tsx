import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import BlogPostForm from "@/frontend/components/admin/BlogPostForm";
import Reveal from "@/frontend/components/motion/Reveal";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div>
      <Reveal className="mb-6">
        <Link
          href="/admin/blog"
          className="mb-2 flex w-fit items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to blog
        </Link>
        <h1 className="text-2xl font-extrabold text-text">Edit Post</h1>
        <p className="mt-1 text-sm text-text/50">{post.title}</p>
      </Reveal>
      <BlogPostForm post={post} />
    </div>
  );
}
