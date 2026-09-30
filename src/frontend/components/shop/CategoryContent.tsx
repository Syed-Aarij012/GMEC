import type { CategoryContentSection, CategoryTable } from "@/backend/lib/categorySeo";
import { renderInlineMarkdown as renderInline } from "@/frontend/lib/renderInlineMarkdown";
import Reveal from "@/frontend/components/motion/Reveal";

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

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2.5 text-sm leading-relaxed text-text/70">
      {items.map((item, k) => (
        <li key={k} className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas-muted text-xs font-bold text-text/70">
            {k + 1}
          </span>
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ol>
  );
}

function DataTable({ table }: { table: CategoryTable }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line/10">
      {table.caption && (
        <div className="border-b border-line/10 bg-canvas-muted px-4 py-2.5 text-sm font-semibold text-text">
          {table.caption}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas-muted text-xs font-semibold uppercase tracking-wide text-text/50">
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/10">
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="whitespace-nowrap px-4 py-3 text-text/70">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
            {section.numberedList && <NumberedList items={section.numberedList} />}
            {section.table && <DataTable table={section.table} />}
            {section.more?.map((block, b) => (
              <div key={b} className="space-y-4">
                {block.paragraphs && <Paragraphs items={block.paragraphs} />}
                {block.list && <List items={block.list} />}
                {block.numberedList && <NumberedList items={block.numberedList} />}
                {block.table && <DataTable table={block.table} />}
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
