import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays, User } from "lucide-react";
import { prisma } from "@/backend/lib/prisma";
import { getSiteUrl } from "@/backend/lib/site";
import Reveal from "@/frontend/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// Lightweight markdown-lite: "## " / "### " lines become headings, blank
// lines separate paragraphs. Keeps BlogPost.content a plain text field
// (no HTML/markdown renderer dependency) while still supporting the
// section structure long-form guides need.
function renderContent(content: string) {
  const blocks = content.split(/\n+/).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mb-4 mt-8 text-xl font-bold text-text">
          {block.slice(4)}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mb-4 mt-10 text-2xl font-extrabold text-text">
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="mb-5 leading-relaxed text-text/80">
        {block}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "GMEC Corporation",
      url: `${siteUrl}/`,
    },
    publisher: {
      "@type": "Organization",
      name: "GMEC Corporation",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/gmec-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Reveal className="mb-6 flex items-center gap-1.5 text-sm text-text/50">
        <Link href="/blog" className="hover:text-gold-600">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-text/70">{post.title}</span>
      </Reveal>

      <article className="mx-auto max-w-3xl">
        <Reveal>
          <h1 className="text-3xl font-extrabold text-text sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text/50">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-canvas-muted">
          <Image src={post.coverImage} alt={post.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 768px" className="object-cover" />
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          {renderContent(post.content)}
        </Reveal>

        <Reveal delay={0.15} className="mt-10 border-t border-line/10 pt-6">
          <Link href="/blog" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
            ← Back to all posts
          </Link>
        </Reveal>
      </article>
    </div>
  );
}
