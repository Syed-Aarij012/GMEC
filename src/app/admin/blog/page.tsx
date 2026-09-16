import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Newspaper } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import DeleteButton from "@/frontend/components/admin/DeleteButton";
import Reveal from "@/frontend/components/motion/Reveal";
import { AnimatedTableBody, AnimatedTableRow } from "@/frontend/components/admin/AnimatedTable";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Reveal className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Blog</h1>
          <p className="mt-1 text-sm text-text/50">{posts.length} posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </Reveal>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line/15 bg-canvas py-16 text-center">
          <Newspaper className="h-10 w-10 text-text/20" />
          <p className="mt-3 text-text/60">No posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-canvas-muted text-left text-xs font-semibold uppercase tracking-wide text-text/50">
                <tr>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <AnimatedTableBody>
                {posts.map((post) => (
                  <AnimatedTableRow key={post.id}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-canvas-muted ring-1 ring-line/10">
                        <Image src={post.coverImage} alt={post.title} fill unoptimized sizes="44px" className="object-cover" />
                      </div>
                      <p className="font-medium text-text">{post.title}</p>
                    </td>
                    <td className="px-4 py-3 text-text/70">{post.author}</td>
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-canvas-muted px-2.5 py-1 text-xs font-medium text-text/60">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text/60">
                      {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-text/40 transition-colors hover:bg-canvas-muted hover:text-text"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton url={`/api/admin/blog/${post.id}`} confirmText={`Delete "${post.title}"?`} />
                      </div>
                    </td>
                  </AnimatedTableRow>
                ))}
              </AnimatedTableBody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
