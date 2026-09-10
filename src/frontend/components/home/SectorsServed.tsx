"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/frontend/components/motion/Reveal";

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=75`;
}

const sectors = [
  {
    title: "Electrical Contractors",
    alt: "Electrical contractor fitting a GMEC GU10 downlight during a rewire",
    image: unsplash("1645449781249-27c94448f6f7"),
  },
  {
    title: "Property Developers",
    alt: "GMEC LED lighting installed throughout a new-build property development",
    image: unsplash("1684966693180-45b9e18aff8d"),
  },
  {
    title: "Property Management",
    alt: "GMEC LED lighting maintained across a managed residential property",
    image: unsplash("1758448721134-1798533ae917"),
  },
  {
    title: "Hotels & Hospitality",
    alt: "GMEC LED downlights installed in a hotel corridor",
    image: unsplash("1758193783649-13371d7fb8dd"),
  },
  {
    title: "Retail Stores",
    alt: "GMEC LED lighting fitted out in a retail store",
    image: unsplash("1761090617068-f1b3257d27ad"),
  },
  {
    title: "Offices & Workspaces",
    alt: "GMEC LED panel lighting installed in an office workspace",
    image: unsplash("1758518727707-b023e285b709"),
  },
  {
    title: "Landlords & Lettings",
    alt: "GMEC LED fittings installed in a rental property by a landlord",
    image: unsplash("1741156386380-0236c72eb6f9"),
  },
  {
    title: "Schools & Colleges",
    alt: "GMEC LED lighting installed in a school classroom",
    image: unsplash("1652305500057-0fcb348b62aa"),
  },
];

export default function SectorsServed() {
  const cards = [...sectors, ...sectors];

  return (
    <section className="bg-ink-900">
      <div className="container-page pt-16">
        <Reveal className="mb-10 max-w-xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Who We Serve</h2>
          <p className="mt-2 text-cream-100/70">
            Alongside everyday homeowners, we work with businesses that need
            lighting they can depend on.
          </p>
        </Reveal>
      </div>

      <div className="group overflow-hidden py-2">
        <div className="flex w-max animate-marquee-slow items-center gap-5 group-hover:[animation-play-state:paused]">
          {cards.map(({ title, alt, image }, i) => (
            <div
              key={`${title}-${i}`}
              className="relative h-56 w-72 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-64 sm:w-80"
            >
              <Image
                src={image}
                alt={alt}
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
              <h3 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page pb-16">
        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-bold text-ink-950 transition-transform hover:scale-105 hover:bg-gold-400"
          >
            Enquire About a Trade Account
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
