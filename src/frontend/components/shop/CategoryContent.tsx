import type { CategoryContentSection } from "@/backend/lib/categorySeo";
import Reveal from "@/frontend/components/motion/Reveal";

export default function CategoryContent({ sections }: { sections: CategoryContentSection[] }) {
  return (
    <div className="mt-16 space-y-10 border-t border-line/10 pt-10">
      {sections.map((section, i) => (
        <Reveal key={i} className="max-w-3xl">
          {section.heading && (
            <h2 className="mb-3 text-xl font-extrabold text-text">{section.heading}</h2>
          )}
          <div className="space-y-4 text-sm leading-relaxed text-text/70">
            {section.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
          {section.list && (
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text/70">
              {section.list.map((item, k) => (
                <li key={k} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </div>
  );
}
