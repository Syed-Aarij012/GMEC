import type { ReactNode } from "react";
import Link from "next/link";

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

// Supports [text](url) links (internal paths use next/link) and **bold**.
// Shared by anywhere CategorySeo/CategoryContentSection copy is rendered,
// so a bare string field (like CategorySeo.intro) gets the same markdown-lite
// treatment as the structured `content` sections instead of showing raw
// "[text](url)" syntax to visitors.
export function renderInlineMarkdown(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[3] !== undefined) {
      out.push(
        <strong key={m.index} className="font-semibold text-text">
          {m[3]}
        </strong>,
      );
    } else {
      const href = m[2];
      const external = /^https?:\/\//.test(href);
      out.push(
        <Link
          key={m.index}
          href={href}
          {...(external ? { rel: "noopener" } : {})}
          className="font-medium text-text/80 underline underline-offset-2 hover:text-gold-600"
        >
          {m[1]}
        </Link>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
