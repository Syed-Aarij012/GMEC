import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { areaPages, areaHref, areaSlugsForRegion } from "@/backend/lib/areaPages";
import AreaPageView from "@/frontend/components/area/AreaPageView";

export function generateStaticParams() {
  return areaSlugsForRegion("kent").map((area) => ({ area }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const page = areaPages[area];
  if (!page || (page.region ?? "london") !== "kent") return { title: "Area not found" };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: areaHref(area) },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const page = areaPages[area];
  if (!page || (page.region ?? "london") !== "kent") notFound();
  return <AreaPageView page={page} />;
}
