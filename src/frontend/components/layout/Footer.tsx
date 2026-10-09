import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "./Logo";

interface CategoryLink {
  slug: string;
  name: string;
}

export default function Footer({ categories }: { categories: CategoryLink[] }) {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-cream-100 print:hidden">
      <Image
        src="/footer/bulbs-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover object-bottom opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/45 via-ink-950/60 to-ink-950/85" />
      <div className="container-page relative grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Logo dark />
          <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
            Trade and retail supplier of LED lighting, fittings and smart home
            gadgets, serving homeowners, electrical contractors, property
            developers and the hospitality industry across the UK.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.instagram.com/gmec_corporation/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GMEC Corporation on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream-100 hover:bg-gold-500 hover:text-ink-950"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold-400">
            SHOP
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li>
              <Link href="/shop" className="hover:text-gold-400">
                All Products
              </Link>
            </li>
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:text-gold-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold-400">
            CUSTOMER SERVICE
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li>
              <Link href="/contact" className="hover:text-gold-400">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gold-400">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/led-lighting-london" className="hover:text-gold-400">
                Areas We Serve
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-gold-400">
                Track My Order
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-400">
                Trade Accounts
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold-400">
            POLICIES
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-100/80">
            <li>
              <Link href="/privacy-policy" className="hover:text-gold-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/payment-policy" className="hover:text-gold-400">
                Payment Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-gold-400">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/refund-returns-policy" className="hover:text-gold-400">
                Refund &amp; Returns Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-gold-400">
            GET IN TOUCH
          </h3>
          <ul className="space-y-3 text-sm text-cream-100/80">
            <li className="flex gap-2.5">
              <MapPin className="h-5 w-5 shrink-0 text-gold-400" />
              GMEC House, Keppel Road, London E6 2BD
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-5 w-5 shrink-0 text-gold-400" />
              <a href="tel:+447951282482" className="hover:text-gold-400">
                +44 7951 282482
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-5 w-5 shrink-0 text-gold-400" />
              <a href="mailto:info@gmeccorporation.com" className="hover:text-gold-400">
                info@gmeccorporation.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} GMEC Corporation. All rights reserved.</p>
          <p>Secure payments · 14-day returns · 24/7 support</p>
        </div>
      </div>
    </footer>
  );
}
