import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BlogPostForm from "@/frontend/components/admin/BlogPostForm";
import Reveal from "@/frontend/components/motion/Reveal";

export default function NewBlogPostPage() {
  return (
    <div>
      <Reveal className="mb-6">
        <Link
          href="/admin/blog"
          className="mb-2 flex w-fit items-center gap-1 text-sm font-semibold text-text/60 hover:text-gold-600"
        >
          <ChevronLeft className="h-4 w-4" /> Back to blog
        </Link>
        <h1 className="text-2xl font-extrabold text-text">New Post</h1>
      </Reveal>
      <BlogPostForm />
    </div>
  );
}
