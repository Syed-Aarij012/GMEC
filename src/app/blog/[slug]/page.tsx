import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays, Clock, User } from "lucide-react";
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

// Parses "[text](url)" markdown-lite links inside a block of text into
// real <Link>/<a> elements, leaving the rest as plain text.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

// Auto-links the first mention of the brand name in a post to the homepage.
// `state` is shared across every block of a single post so only the very
// first occurrence in the whole article gets linked, however many times
// the phrase appears.
const BRAND_PATTERN = /gmec corporation/i;

function linkifyBrandMention(text: string, state: { linked: boolean }): ReactNode[] {
  if (state.linked) return [text];
  const match = BRAND_PATTERN.exec(text);
  if (!match) return [text];
  state.linked = true;
  const start = match.index;
  const end = start + match[0].length;
  const before = text.slice(0, start);
  const after = text.slice(end);
  return [
    ...(before ? [before] : []),
    <Link key="brand-mention" href="https://www.gmeccorporation.com/" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
      {match[0]}
    </Link>,
    ...(after ? [after] : []),
  ];
}

function renderInline(text: string, brandState: { linked: boolean }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text))) {
    const [full, label, href] = match;
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key++} href={href} className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
          {label}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  // Only plain-text segments are eligible: text already turned into a
  // manual link above is left alone so we never nest an <a> inside an <a>.
  return nodes.flatMap((node) => (typeof node === "string" ? linkifyBrandMention(node, brandState) : node));
}

// Lightweight markdown-lite: "## " / "### " lines become headings, blank
// lines separate paragraphs, "[text](url)" becomes a link. Keeps
// BlogPost.content a plain text field (no HTML/markdown renderer
// dependency) while still supporting the section structure and internal
// linking long-form guides need.
function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Posts listed here render with the "guide" layout: a full-width cover hero,
// a sticky "In this guide" contents list, numbered section headings and a
// closing call-to-action card. Every other post keeps the classic layout.
const GUIDE_LAYOUT: Record<string, { ctaHref: string; ctaLabel: string }> = {
  "gu10-downlights-buying-guide-sizes-brightness-fitting": {
    ctaHref: "/shop/gu10-downlights",
    ctaLabel: "Shop GU10 downlights",
  },
};

function renderContent(content: string, guide = false) {
  const blocks = content.split(/\n+/).filter(Boolean);
  // Shared across every paragraph in this post so only the first mention
  // of the brand name in the body copy is linked, not headings.
  const brandState = { linked: false };
  const headingState = { linked: true };
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mb-4 mt-8 text-xl font-bold text-text">
          {renderInline(block.slice(4), headingState)}
        </h3>
      );
    }
    if (block.startsWith("## ")) {
      const title = block.slice(3);
      if (guide) {
        return (
          <h2
            key={i}
            id={slugifyHeading(title)}
            className="mb-4 mt-12 scroll-mt-24 border-l-4 border-gold-500 pl-4 text-2xl font-extrabold text-text"
          >
            {renderInline(title, headingState)}
          </h2>
        );
      }
      return (
        <h2 key={i} className="mb-4 mt-10 text-2xl font-extrabold text-text">
          {renderInline(title, headingState)}
        </h2>
      );
    }
    return (
      <p key={i} className="mb-5 leading-relaxed text-text/80">
        {renderInline(block, brandState)}
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

  const guide = GUIDE_LAYOUT[post.slug];
  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );

  if (guide) {
    const toc = post.content
      .split(/\n+/)
      .filter((l) => l.startsWith("## "))
      .map((l) => l.slice(3));
    const minutes = Math.max(1, Math.round(post.content.split(/\s+/).length / 220));

    return (
      <div>
        {jsonLd}
        <header className="bg-neutral-900">
          <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_380px]">
            <Reveal>
              <div className="mb-5 flex items-center gap-1.5 text-sm text-white/60">
                <Link href="/blog" className="hover:text-gold-400">
                  Blog
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Buying guide</span>
              </div>
              <span className="inline-block rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                Buying guide
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">{post.title}</h1>
              <p className="mt-4 text-base text-white/75 sm:text-lg">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {minutes} min read
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl lg:max-w-none">
              <Image src={post.coverImage} alt={post.title} fill unoptimized priority sizes="(max-width: 1024px) 384px, 380px" className="object-cover" />
            </Reveal>
          </div>
        </header>

        <div className="container-page grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="In this guide" className="rounded-2xl border border-line/10 bg-canvas-muted p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text/50">In this guide</p>
              <ol className="space-y-2 text-sm">
                {toc.map((t, n) => (
                  <li key={t} className="flex gap-2">
                    <span className="font-bold text-gold-600">{n + 1}.</span>
                    <a href={`#${slugifyHeading(t)}`} className="text-text/70 hover:text-gold-600">
                      {t}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="max-w-3xl">
            <Reveal>{renderContent(post.content, true)}</Reveal>

            <Reveal className="mt-12 rounded-2xl bg-neutral-900 p-8 text-white">
              <h2 className="text-2xl font-extrabold">Ready to choose your lights?</h2>
              <p className="mt-2 text-white/70">
                Free UK delivery over £100, 14-day returns and 24/7 support. Not sure whether you need fire-rated? Ask our team.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={guide.ctaHref} className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-400">
                  {guide.ctaLabel}
                </Link>
                <Link href="/contact" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                  Contact our team
                </Link>
              </div>
            </Reveal>

            <div className="mt-10 border-t border-line/10 pt-6">
              <Link href="/blog" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                ← Back to all posts
              </Link>
            </div>
          </article>
        </div>
      </div>
    );
  }

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
