const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const OUT_DIR = path.join(__dirname, "..", "..", "public", "uploads", "products");

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(png|jpe?g|webp|gif|avif)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

function localNameFromUrl(url) {
  const clean = url.split("?")[0];
  const base = path.basename(clean).replace(/[^a-zA-Z0-9._-]/g, "");
  return base || `img-${Date.now()}.jpg`;
}

async function downloadTo(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { images: { contains: "gmeccorporation.com" } },
    select: { id: true, name: true, images: true },
  });

  console.log(`Products with remote images: ${products.length}`);

  const urlToLocal = new Map();
  let downloaded = 0;
  let failed = 0;

  for (const p of products) {
    const urls = JSON.parse(p.images);
    const newUrls = [];

    for (const url of urls) {
      if (!url.includes("gmeccorporation.com")) {
        newUrls.push(url);
        continue;
      }

      if (urlToLocal.has(url)) {
        newUrls.push(urlToLocal.get(url));
        continue;
      }

      let filename = localNameFromUrl(url);
      let destPath = path.join(OUT_DIR, filename);
      let attempt = 2;
      while (fs.existsSync(destPath) && !urlToLocal.get(url)) {
        const ext = extFromUrl(url);
        const stem = filename.replace(new RegExp(`\\.${ext}$`, "i"), "");
        filename = `${stem}-${attempt}.${ext}`;
        destPath = path.join(OUT_DIR, filename);
        attempt++;
      }

      try {
        const size = await downloadTo(url, destPath);
        const localUrl = `/uploads/products/${filename}`;
        urlToLocal.set(url, localUrl);
        newUrls.push(localUrl);
        downloaded++;
        console.log(`OK  ${p.name} -> ${filename} (${size} bytes)`);
      } catch (err) {
        failed++;
        console.error(`FAIL ${p.name}: ${url} -> ${err.message}`);
        newUrls.push(url); // keep remote fallback on failure
      }
    }

    await prisma.product.update({
      where: { id: p.id },
      data: { images: JSON.stringify(newUrls) },
    });
  }

  console.log(`\nDownloaded: ${downloaded}, Failed: ${failed}, Unique files: ${urlToLocal.size}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
