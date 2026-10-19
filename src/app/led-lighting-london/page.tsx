import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { areaPages, areaHref, areaSlugsForRegion } from "@/backend/lib/areaPages";
import Reveal from "@/frontend/components/motion/Reveal";
import StaggerGrid, { StaggerItem } from "@/frontend/components/motion/StaggerGrid";

export const metadata: Metadata = {
  title: "LED Lighting Supplier in East London | GMEC Corporation",
  description:
    "GMEC Corporation supplies trade and retail LED lighting across East London, from our East Ham base. Find your local area for pricing, categories and trade accounts.",
  alternates: { canonical: "/led-lighting-london" },
};

export default function LondonHubPage() {
  return (
    <div className="container-page py-14">
      <Reveal className="mb-6 flex items-center gap-1.5 text-sm text-text/50">
        <Link href="/" className="hover:text-gold-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text/70">London</span>
      </Reveal>

      <Reveal className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-text sm:text-4xl">LED Lighting Supplier in East London</h1>
        <p className="mt-4 text-text/60">
          GMEC Corporation is based on Keppel Road, East Ham, supplying trade and retail LED bulbs,
          downlights, ceiling lights and smart home gadgets to homeowners, electricians and property
          teams across East London. Choose your area below for local categories, pricing and trade
          account details.
        </p>
      </Reveal>

      <StaggerGrid className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {areaSlugsForRegion("london").map((slug) => {
          const area = areaPages[slug];
          return (
            <StaggerItem key={slug} hoverLift>
              <Link
                href={areaHref(slug)}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-line/10 bg-canvas p-6 shadow-sm hover:border-gold-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas-muted text-gold-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-text group-hover:text-gold-600">{area.name}</h2>
                <p className="flex-1 text-sm text-text/60">{area.description}</p>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                  View {area.name} <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </div>
  );
}
