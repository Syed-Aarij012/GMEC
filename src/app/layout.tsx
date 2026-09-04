import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/frontend/components/layout/SiteChrome";
import AuthSessionProvider from "@/frontend/components/providers/AuthSessionProvider";
import ThemeScript from "@/frontend/components/providers/ThemeScript";
import { prisma } from "@/backend/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gmeccorporation.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GMEC Corporation | LED Lighting & Smart Gadgets",
    template: "%s | GMEC Corporation",
  },
  description:
    "GMEC Corporation supplies LED bulbs, fittings, ceiling lights and smart home gadgets to homeowners and trade customers across the UK. Free delivery over £100.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GMEC Corporation",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/gmec-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "GMEC House, Keppel Road",
    addressLocality: "London",
    postalCode: "E6 2BD",
    addressCountry: "GB",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-7951-282482",
    email: "info@gmeccorporation.com",
    contactType: "customer service",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await prisma.category
    .findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    })
    .catch(() => []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ThemeScript />
        <AuthSessionProvider>
          <SiteChrome categories={categories}>{children}</SiteChrome>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
