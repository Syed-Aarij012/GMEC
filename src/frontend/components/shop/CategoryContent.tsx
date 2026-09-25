import type { ReactNode } from "react";
import Link from "next/link";
import type { CategoryContentSection } from "@/backend/lib/categorySeo";
import Reveal from "@/frontend/components/motion/Reveal";

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

// Supports [text](url) links (internal paths use next/link) and **bold**.
function renderInline(text: string): ReactNode[] {
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

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-text/70">
      {items.map((p, j) => (
        <p key={j}>{renderInline(p)}</p>
      ))}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-text/70">
      {items.map((item, k) => (
        <li key={k} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryContent({ sections }: { sections: CategoryContentSection[] }) {
  return (
    <div className="mt-16 space-y-10 border-t border-line/10 pt-10">
      {sections.map((section, i) => (
        <Reveal key={i} className="max-w-3xl">
          {section.heading && (
            <h2 className="mb-3 text-xl font-extrabold text-text">{section.heading}</h2>
          )}
          <div className="space-y-4">
            <Paragraphs items={section.paragraphs} />
            {section.list && <List items={section.list} />}
            {section.more?.map((block, b) => (
              <div key={b} className="space-y-4">
                {block.paragraphs && <Paragraphs items={block.paragraphs} />}
                {block.list && <List items={block.list} />}
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
