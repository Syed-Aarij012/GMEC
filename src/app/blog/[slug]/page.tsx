import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays, Clock, User, Wrench, Gauge, CheckCircle2 } from "lucide-react";
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

// Parses "[text](url)" markdown-lite links and "**bold**" spans inside a
// block of text into real elements, leaving the rest as plain text.
const TOKEN_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

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

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(text))) {
    const [full, label, href, bold] = match;
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (bold !== undefined) {
      nodes.push(
        <strong key={key++} className="font-semibold text-text">
          {bold}
        </strong>
      );
    } else if (href.startsWith("/")) {
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

function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Posts listed here render with the "guide" layout: a full-width dark cover
// hero, a sticky "In this guide" sidebar contents list, gold-rule section
// headings and a closing dark call-to-action card.
const GUIDE_LAYOUT: Record<string, { ctaHref: string; ctaLabel: string }> = {
  "gu10-downlights-buying-guide-sizes-brightness-fitting": {
    ctaHref: "/shop/gu10-downlights",
    ctaLabel: "Shop GU10 downlights",
  },
};

// Posts listed here render with the "howto" layout: a light quick-facts
// hero, a horizontal jump-to-section chip nav, numbered gold section
// badges and a bordered (non-dark) closing call-to-action card. Used for
// step-by-step DIY guides, as distinct from the buying-guide layout above.
const HOWTO_LAYOUT: Record<
  string,
  { ctaHref: string; ctaLabel: string; difficulty: string; time: string; tools: string }
> = {
  "how-to-install-gu10-downlights-diy-guide": {
    ctaHref: "/shop/gu10-downlights",
    ctaLabel: "Shop GU10 LED bulbs",
    difficulty: "Beginner friendly",
    time: "10-15 mins per fitting",
    tools: "Ladder, work gloves",
  },
};

type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

// Splits BlogPost.content into typed blocks: "## "/"### " lines become
// headings, "- " lines group into a bullet list, "N. " lines group into a
// numbered list, and everything else is a paragraph. Keeps content a plain
// text field (no HTML/markdown renderer dependency) while still supporting
// the section structure, lists and internal linking long-form guides need.
function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split(/\n+/).filter(Boolean);
  const blocks: ContentBlock[] = [];
  for (const line of lines) {
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    const bulletMatch = /^-\s+(.*)$/.exec(line);
    if (bulletMatch) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(bulletMatch[1]);
      else blocks.push({ type: "ul", items: [bulletMatch[1]] });
      continue;
    }
    const numberedMatch = /^\d+\.\s+(.*)$/.exec(line);
    if (numberedMatch) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ol") last.items.push(numberedMatch[1]);
      else blocks.push({ type: "ol", items: [numberedMatch[1]] });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }
  return blocks;
}

function renderContent(content: string, variant: "classic" | "guide" | "howto" = "classic") {
  const blocks = parseContentBlocks(content);
  // Shared across every paragraph in this post so only the first mention
  // of the brand name in the body copy is linked, not headings.
  const brandState = { linked: false };
  const headingState = { linked: true };
  let h2Index = 0;

  return blocks.map((block, i) => {
    if (block.type === "h3") {
      if (variant === "howto") {
        return (
          <h3 key={i} className="mb-4 mt-8 flex items-center gap-2.5 text-lg font-bold text-text">
            <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" />
            {renderInline(block.text, headingState)}
          </h3>
        );
      }
      return (
        <h3 key={i} className="mb-4 mt-8 text-xl font-bold text-text">
          {renderInline(block.text, headingState)}
        </h3>
      );
    }

    if (block.type === "h2") {
      if (variant === "guide") {
        return (
          <h2
            key={i}
            id={slugifyHeading(block.text)}
            className="mb-4 mt-12 scroll-mt-24 border-l-4 border-gold-500 pl-4 text-2xl font-extrabold text-text"
          >
            {renderInline(block.text, headingState)}
          </h2>
        );
      }
      if (variant === "howto") {
        h2Index += 1;
        return (
          <h2
            key={i}
            id={slugifyHeading(block.text)}
            className="mb-5 mt-14 flex scroll-mt-24 items-center gap-3 text-2xl font-extrabold text-text"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-extrabold text-black">
              {h2Index}
            </span>
            {renderInline(block.text, headingState)}
          </h2>
        );
      }
      return (
        <h2 key={i} className="mb-4 mt-10 text-2xl font-extrabold text-text">
          {renderInline(block.text, headingState)}
        </h2>
      );
    }

    if (block.type === "ul") {
      return (
        <ul key={i} className="mb-5 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-2.5 leading-relaxed text-text/80">
              {variant === "howto" ? (
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gold-600" />
              ) : (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              )}
              <span>{renderInline(item, brandState)}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === "ol") {
      return (
        <ol key={i} className="mb-5 space-y-3">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3 leading-relaxed text-text/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas-muted text-xs font-bold text-text/70">
                {j + 1}
              </span>
              <span>{renderInline(item, brandState)}</span>
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p key={i} className="mb-5 leading-relaxed text-text/80">
        {renderInline(block.text, brandState)}
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
            <Reveal>{renderContent(post.content, "guide")}</Reveal>

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

  const howto = HOWTO_LAYOUT[post.slug];
  if (howto) {
    const toc = post.content
      .split(/\n+/)
      .filter((l) => l.startsWith("## "))
      .map((l) => l.slice(3));

    return (
      <div>
        {jsonLd}
        <header className="border-b border-line/10 bg-canvas-muted">
          <div className="container-page py-12 sm:py-16">
            <Reveal className="mx-auto max-w-3xl text-center">
              <div className="mb-5 flex items-center justify-center gap-1.5 text-sm text-text/50">
                <Link href="/blog" className="hover:text-gold-600">
                  Blog
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>DIY guide</span>
              </div>
              <span className="inline-block rounded-full bg-gold-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                DIY Guide
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-text sm:text-4xl">{post.title}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-text/60">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-center gap-x-5 gap-y-2 text-sm text-text/50">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="relative mx-auto mt-8 aspect-[21/9] w-full max-w-3xl overflow-hidden rounded-2xl shadow-sm">
              <Image src={post.coverImage} alt={post.title} fill unoptimized priority sizes="(max-width: 1024px) 100vw, 768px" className="object-cover" />
            </Reveal>

            <Reveal delay={0.1} className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-line/10 bg-canvas px-4 py-3">
                <Gauge className="h-4 w-4 shrink-0 text-gold-600" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text/40">Difficulty</p>
                  <p className="text-sm font-semibold text-text">{howto.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-line/10 bg-canvas px-4 py-3">
                <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text/40">Time needed</p>
                  <p className="text-sm font-semibold text-text">{howto.time}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2.5 rounded-xl border border-line/10 bg-canvas px-4 py-3 sm:col-span-1">
                <Wrench className="h-4 w-4 shrink-0 text-gold-600" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-text/40">You&apos;ll need</p>
                  <p className="text-sm font-semibold text-text">{howto.tools}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </header>

        <div className="container-page py-12">
          <article className="mx-auto max-w-3xl">
            <Reveal className="-mx-1 mb-10 flex gap-2 overflow-x-auto pb-2">
              {toc.map((t, n) => (
                <a
                  key={t}
                  href={`#${slugifyHeading(t)}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-line/10 bg-canvas-muted px-3.5 py-1.5 text-xs font-semibold text-text/70 hover:border-gold-500 hover:text-gold-600"
                >
                  <span className="text-gold-600">{n + 1}.</span> {t}
                </a>
              ))}
            </Reveal>

            <Reveal>{renderContent(post.content, "howto")}</Reveal>

            <Reveal className="mt-12 rounded-2xl border border-gold-500/30 bg-canvas-muted p-8">
              <h2 className="text-2xl font-extrabold text-text">Ready to fit your new downlights?</h2>
              <p className="mt-2 text-text/60">
                Free UK delivery over £100, 14-day returns and 24/7 support. Not sure which brightness or fitting you need? Ask our team.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={howto.ctaHref} className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-black hover:bg-gold-400">
                  {howto.ctaLabel}
                </Link>
                <Link href="/contact" className="rounded-full border border-line/20 px-5 py-2.5 text-sm font-semibold text-text hover:bg-canvas">
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
