import { prisma } from "@/backend/lib/prisma";
import { getSiteUrl } from "@/backend/lib/site";
import { getProductImages } from "@/frontend/lib/product";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveImageUrl(path: string, siteUrl: string): string {
  return /^https?:\/\//.test(path) ? path : `${siteUrl}${path}`;
}

// Google Shopping / Merchant Center product feed (RSS 2.0 + the Google
// Content API's "g:" namespace). Replaces the dead feed left over from the
// old WooCommerce site, which Merchant Center was still trying to crawl —
// this one is generated live from the current product catalog, so delisted
// or renamed products never show up as "Product page unavailable".
export async function GET() {
  const siteUrl = getSiteUrl();
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const items = products
    .map((product) => {
      const images = getProductImages(product.images);
      const link = `${siteUrl}/product/${product.slug}`;
      const price = `${product.price.toFixed(2)} GBP`;
      const availability = product.stock > 0 ? "in stock" : "out of stock";
      const description = (product.shortDescription || product.description).slice(0, 5000);

      const additionalImages = images
        .slice(1, 11)
        .map((img) => `      <g:additional_image_link>${escapeXml(resolveImageUrl(img, siteUrl))}</g:additional_image_link>`)
        .join("\n");

      return `    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <title>${escapeXml(product.name)}</title>
      <description>${escapeXml(description)}</description>
      <link>${link}</link>
      <g:image_link>${escapeXml(resolveImageUrl(images[0], siteUrl))}</g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:condition>new</g:condition>
      <g:brand>GMEC</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${escapeXml(product.category.name)}</g:product_type>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>GMEC Corporation Product Feed</title>
    <link>${siteUrl}</link>
    <description>Live product feed for Google Merchant Center</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
