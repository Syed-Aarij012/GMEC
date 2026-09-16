import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { StaggerItem } from "@/frontend/components/motion/StaggerGrid";
import Pagination from "@/frontend/components/shop/Pagination";

const PAGE_SIZE = 9;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | LED Lighting Guides & News",
  description:
    "Tips, guides and news on LED lighting, energy savings and smart home gadgets from GMEC Corporation.",
  alternates: { canonical: "/blog" },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container-page py-10">
      <Reveal className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-text sm:text-4xl">GMEC Blog</h1>
        <p className="mx-auto mt-3 max-w-2xl text-text/60">
          Guides, tips and news on LED lighting, energy savings and smart home gadgets.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line/15 py-16 text-center text-text/60">
          No posts published yet, check back soon.
        </div>
      ) : (
        <>
          <StaggerGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id} hoverLift>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-canvas-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text/50">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(post.createdAt)}
                    </div>
                    <h2 className="text-lg font-bold text-text group-hover:text-gold-600">{post.title}</h2>
                    <p className="line-clamp-3 flex-1 text-sm text-text/60">{post.excerpt}</p>
                    <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                      Read More <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => (p === 1 ? "/blog" : `/blog?page=${p}`)}
          />
        </>
      )}
    </div>
  );
}
