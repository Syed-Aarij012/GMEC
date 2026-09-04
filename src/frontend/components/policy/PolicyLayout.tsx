import Reveal from "@/frontend/components/motion/Reveal";

export default function PolicyLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="bg-ink-950 py-14">
        <Reveal className="container-page text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            GMEC Corporation
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-cream-100/50">Last updated {updated}</p>
        </Reveal>
      </section>

      <section className="bg-canvas">
        <Reveal className="container-page max-w-3xl py-12 sm:py-16">
          <div className="policy-prose space-y-8 text-sm leading-relaxed text-text/80 sm:text-base">
            {children}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export function PolicySection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold text-text sm:text-xl">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
