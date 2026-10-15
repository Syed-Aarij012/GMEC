import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { areaPages, areaHref, regionInfo, type AreaPageData, type CategoryCard } from "@/backend/lib/areaPages";
import { renderInlineMarkdown } from "@/frontend/lib/renderInlineMarkdown";
import { getSiteUrl } from "@/backend/lib/site";
import TrustBadges from "@/frontend/components/home/TrustBadges";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { StaggerItem } from "@/frontend/components/motion/StaggerGrid";

// Maps a category card's image back to its /shop page, for the "Shop
// category >" link under each card (the same target already linked inline
// in the card body — kept as one source of truth per category image).
const IMAGE_HREF: Record<string, string> = {
  "/uploads/products/chrome_downlight_banner_3-gold.webp": "/shop/gu10-downlights",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-9-scaled-2.png": "/shop/led-filament-bulbs",
  "/uploads/products/led_panel_product_1-gold.webp": "/shop/led-ceiling-lights",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-17-scaled.png": "/shop/led-rgb-lights",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-5-scaled.png": "/shop/smart-gadgets",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-7-scaled.png": "/shop/led-candle-bulbs",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-3-scaled-2-3.png": "/shop/led-frosted-bulbs",
  "/uploads/products/GMEC-LED-LIhts-UK-Lights-01-25-scaled.png": "/shop/cool-white-led-bulbs",
};

function categoryHref(card: CategoryCard): string {
  return IMAGE_HREF[card.image] ?? "/shop";
}

export default function AreaPageView({ page }: { page: AreaPageData }) {
  const region = regionInfo[page.region ?? "london"];
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${areaHref(page.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.title,
        description: page.description,
        inLanguage: "en-GB",
        isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "GMEC Corporation" },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        about: { "@id": `${siteUrl}/#localbusiness` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: region.label, item: `${siteUrl}${region.base}` },
          { "@type": "ListItem", position: 3, name: page.name, item: pageUrl },
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#localbusiness`,
        name: "GMEC Corporation",
        url: `${siteUrl}/`,
        description:
          "Trade and retail supplier of LED bulbs, downlights, ceiling lights and smart home gadgets, based on Keppel Road, East Ham.",
        telephone: "+447951282482",
        email: "info@gmeccorporation.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "GMEC House, Keppel Road",
          addressLocality: "London",
          postalCode: "E6 2BD",
          addressCountry: "GB",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: "+447951282482",
          email: "info@gmeccorporation.com",
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: page.name },
          ...page.areasWeSupply.map((a) => ({ "@type": "Place", name: a.title })),
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faqs.map((f) => ({
          "@type": "Question",
          name: f.title,
          acceptedAnswer: { "@type": "Answer", text: f.body.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") },
        })),
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1. Breadcrumb */}
      <div className="border-b border-line/10 bg-canvas-muted">
        <div className="container-page flex items-center gap-1.5 py-3 text-sm text-text/50">
          <Link href="/" className="hover:text-gold-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={region.base} className="hover:text-gold-600">{region.label}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text/70">{page.name}</span>
        </div>
      </div>

      {/* 2. Hero */}
      <header className="bg-canvas-muted">
        <div className="container-page grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1fr_440px]">
          <Reveal>
            <h1 className="text-3xl font-extrabold text-text sm:text-5xl">
              LED Lighting Supplier Near {page.name}
            </h1>
            <div className="mt-5 space-y-4 text-text/70">
              {page.heroIntro.map((p, i) => (
                <p key={i}>{renderInlineMarkdown(p)}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-black hover:bg-gold-400"
              >
                Open a Trade Account
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-line/20 px-6 py-3 text-sm font-semibold text-text hover:bg-canvas"
              >
                Shop All LED Lighting
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src={page.heroImage}
              alt={page.heroAlt}
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 100vw, 440px"
              className="object-cover"
            />
          </Reveal>
        </div>
      </header>

      {/* 3. Trust bar */}
      <TrustBadges />

      {/* 4. Popular categories */}
      <section className="border-b border-line/10 py-16">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">
              Popular LED Lighting Categories Near {page.name}
            </h2>
            <p className="mt-3 text-text/60">{page.categoriesIntro}</p>
          </Reveal>
          <StaggerGrid className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.categories.map((card, i) => (
              <StaggerItem key={i} hoverLift>
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-canvas shadow-sm">
                  <div className="relative aspect-[4/3] bg-canvas-muted">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-base font-bold text-text">{card.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-text/60">{renderInlineMarkdown(card.body)}</p>
                    <Link
                      href={categoryHref(card)}
                      className="mt-1 flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700"
                    >
                      Shop category <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 5. Trades and property teams */}
      <section className="border-b border-line/10 bg-canvas-muted py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">{page.tradeTeamsHeading}</h2>
          </Reveal>
          <StaggerGrid className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {page.tradeTeams.map((card, i) => (
              <StaggerItem key={i}>
                <div className="h-full rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm">
                  <span className="mb-3 block h-2.5 w-2.5 rounded-full bg-gold-500" />
                  <h3 className="text-sm font-bold text-text">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text/60">{renderInlineMarkdown(card.body)}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <Reveal className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-gold-600 hover:text-ink-950"
            >
              Enquire About a Trade Account
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6. Areas we supply */}
      <section className="border-b border-line/10 py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Areas We Supply Near {page.name}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {page.areasWeSupply.map((a, i) => (
              <Reveal key={i} delay={Math.min(i, 4) * 0.05}>
                <h3 className="text-lg font-bold text-text">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text/60">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why buy from GMEC */}
      <section className="border-b border-line/10 bg-canvas-muted py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Why Buy LED Lighting From GMEC</h2>
          </Reveal>
          <StaggerGrid className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {page.whyBuy.map((card, i) => (
              <StaggerItem key={i}>
                <div className="h-full rounded-2xl border border-line/10 bg-canvas p-5 shadow-sm">
                  <span className="mb-3 block h-2.5 w-2.5 rounded-full bg-gold-500" />
                  <h3 className="text-sm font-bold text-text">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-text/60">{card.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="border-b border-line/10 py-16">
        <div className="container-page max-w-3xl">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">{page.name} LED Lighting FAQs</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {page.faqs.map((faq, i) => (
              <details
                key={i}
                open={i === 0}
                className="group rounded-xl border border-line/10 bg-canvas px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <h3 className="text-sm font-bold text-text sm:text-base">{faq.title}</h3>
                  <span className="shrink-0 text-lg font-bold text-gold-600 group-open:hidden">+</span>
                  <span className="hidden shrink-0 text-lg font-bold text-gold-600 group-open:inline">−</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text/60">{renderInlineMarkdown(faq.body)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Trade account CTA */}
      <section className="bg-ink-900 py-16 text-white">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px]">
          <Reveal>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Open a Trade Account With GMEC</h2>
            <p className="mt-3 text-white/70">{page.tradeCtaIntro}</p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-black hover:bg-gold-400"
            >
              Contact GMEC
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl bg-white p-6 text-text">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                <a href="tel:+447951282482" className="hover:text-gold-600">+44 7951 282482</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold-600" />
                <a href="mailto:info@gmeccorporation.com" className="hover:text-gold-600">info@gmeccorporation.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-gold-600" />
                GMEC House, Keppel Road, London E6 2BD
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 10. Nearby areas */}
      <section className="py-14">
        <div className="container-page">
          <Reveal>
            <h2 className="mb-6 text-xl font-extrabold text-text">Nearby Areas We Supply</h2>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-wrap gap-3">
            {page.nearbyAreas.map((slug) => (
              <Link
                key={slug}
                href={areaHref(slug)}
                className="rounded-full border border-line/15 px-4 py-2 text-sm font-semibold text-text hover:border-gold-500 hover:text-gold-600"
              >
                {areaPages[slug]?.name ?? slug}
              </Link>
            ))}
            <Link
              href={region.base}
              className="rounded-full border border-line/15 px-4 py-2 text-sm font-semibold text-text hover:border-gold-500 hover:text-gold-600"
            >
              Back to the {region.label} hub
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
