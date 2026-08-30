import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, Truck, Users, Award } from "lucide-react";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { StaggerItem } from "@/frontend/components/motion/StaggerGrid";

export const metadata: Metadata = { title: "About Us" };

const stats = [
  { value: "10,000+", label: "Orders Delivered" },
  { value: "30+", label: "Product Lines" },
  { value: "24/7", label: "Customer Support" },
  { value: "14-Day", label: "Returns Window" },
];

const values = [
  {
    icon: Lightbulb,
    title: "Quality First",
    desc: "Every bulb and fitting we stock is tested to perform reliably, day in, day out.",
  },
  {
    icon: Truck,
    title: "Fast, Reliable Delivery",
    desc: "Free UK delivery over £100 +VAT, with dependable dispatch times you can plan around.",
  },
  {
    icon: Users,
    title: "Trade & Retail",
    desc: "Serving homeowners alongside contractors, developers and hospitality businesses.",
  },
  {
    icon: Award,
    title: "Honest Support",
    desc: "Real people on the other end of the phone, 24/7, no call centres.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ink-950 py-16">
        <Reveal className="container-page text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            About GMEC Corporation
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
            Lighting solutions built for real homes and real projects
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream-100/70">
            GMEC Corporation supplies LED lighting, fittings and smart home
            gadgets to homeowners and trade professionals across the UK ,
            combining everyday essentials with the latest connected tech.
          </p>
        </Reveal>
      </section>

      <section className="bg-canvas">
        <StaggerGrid className="container-page grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
          {stats.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-text">{s.value}</p>
              <p className="mt-1 text-sm text-text/60">{s.label}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="bg-canvas-soft">
        <div className="container-page grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Our Story</h2>
            <p className="mt-4 leading-relaxed text-text/70">
              What started as a straightforward LED bulb supplier has grown
              into a full lighting and smart-gadget destination. We saw how
              often contractors and homeowners alike struggled to find the
              right fitting, wattage or colour temperature in stock, so we
              built a range that covers the essentials properly, and backed
              it with delivery and support you can rely on.
            </p>
            <p className="mt-4 leading-relaxed text-text/70">
              Today we supply everyday LED and filament bulbs, fire-rated
              downlights, smart RGB lighting and connected home gadgets to
              customers ranging from single households to hotel groups.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-ink-900 px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-gold-600 hover:text-ink-950"
            >
              Explore the Range
            </Link>
          </Reveal>
          <StaggerGrid className="grid grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title} hoverLift className="rounded-2xl bg-canvas p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas-muted text-gold-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-bold text-text">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-text/60">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
