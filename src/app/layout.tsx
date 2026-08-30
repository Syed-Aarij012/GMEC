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

export const metadata: Metadata = {
  title: {
    default: "GMEC Corporation | LED Lighting & Smart Gadgets",
    template: "%s | GMEC Corporation",
  },
  description:
    "GMEC Corporation supplies LED bulbs, fittings, ceiling lights and smart home gadgets to homeowners and trade customers across the UK. Free delivery over £100.",
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
        <ThemeScript />
        <AuthSessionProvider>
          <SiteChrome categories={categories}>{children}</SiteChrome>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
