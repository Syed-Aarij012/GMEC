// One-off backfill: fetch real product gallery photos from the live
// gmeccorporation.com site (matched via prisma/import research artifacts
// in the scratchpad) and self-host them under public/uploads/products,
// appending to each product's `images` JSON array after the existing
// main image (position 0 is left untouched).
//
// Duplicate detection is content-based (sha256 of the downloaded bytes
// compared against sha256 of every image file already referenced by the
// product) rather than URL-based, since the DB already stores local
// paths, not the original remote URLs.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");
const OUT_DIR = path.join(PUBLIC_DIR, "uploads", "products");

const SCRATCHPAD =
  "C:\\Users\\SYED\\AppData\\Local\\Temp\\claude\\d--GMEC\\386f24c7-04eb-4e24-9ad5-847fa3164baa\\scratchpad";
const MATCHES_PATH = path.join(SCRATCHPAD, "matches.json");
const GALLERY_PATH = path.join(SCRATCHPAD, "gallery-urls-all.json");

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(png|jpe?g|webp|gif|avif)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

// WordPress generates sized renditions like "foo-150x150.png" /
// "foo-1024x1024.png" alongside the original "foo.png". Strip the size
// suffix to request the full-resolution original instead of a thumbnail.
function toFullSizeUrl(url) {
  return url.replace(/-\d+x\d+(?=\.\w+$)/, "");
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function writeFileWithRetry(destPath, buf, attempts = 5, delayMs = 300) {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const attempt = () => {
      tries++;
      try {
        fs.writeFileSync(destPath, buf);
        resolve();
      } catch (err) {
        if (tries >= attempts) {
          reject(err);
        } else {
          setTimeout(attempt, delayMs);
        }
      }
    };
    attempt();
  });
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function hashExistingLocalImages(existingUrls) {
  const hashes = new Set();
  for (const u of existingUrls) {
    if (!u || u.startsWith("http")) continue; // can't hash remote refs
    const abs = path.join(PUBLIC_DIR, u);
    try {
      const buf = fs.readFileSync(abs);
      hashes.add(sha256(buf));
    } catch {
      // file missing on disk; ignore
    }
  }
  return hashes;
}

async function main() {
  const matches = JSON.parse(fs.readFileSync(MATCHES_PATH, "utf8"));
  const galleryMap = JSON.parse(fs.readFileSync(GALLERY_PATH, "utf8"));

  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, slug: true, images: true },
  });

  let productsUpdated = 0;
  let totalDownloaded = 0;
  let totalSkippedDup = 0;
  let totalFailed = 0;
  const skippedProducts = [];
  const failedDownloads = [];

  for (const p of products) {
    const pageUrl = matches[p.sku];
    if (!pageUrl) {
      skippedProducts.push(`${p.name} (${p.sku}) — no matched live URL`);
      continue;
    }
    const rawGalleryUrls = galleryMap[pageUrl];
    if (!rawGalleryUrls || rawGalleryUrls.length === 0) {
      skippedProducts.push(`${p.name} (${p.sku}) — no gallery images found on ${pageUrl}`);
      continue;
    }

    const existingUrls = JSON.parse(p.images);
    const seenHashes = hashExistingLocalImages(existingUrls);

    // Resolve to full-size original URLs and dedupe within this product's list
    const candidateUrls = [];
    const seenFullUrls = new Set();
    for (const raw of rawGalleryUrls) {
      const full = toFullSizeUrl(raw);
      if (seenFullUrls.has(full)) continue;
      seenFullUrls.add(full);
      candidateUrls.push({ full, raw });
    }

    const newLocalPaths = [];
    let n = 1;

    for (const { full, raw } of candidateUrls) {
      let buf;
      try {
        buf = await downloadBuffer(full);
      } catch (err) {
        try {
          // fall back to the thumbnail-sized URL if the "original" 404s
          buf = await downloadBuffer(raw);
        } catch (err2) {
          totalFailed++;
          failedDownloads.push(`${p.name} (${p.sku}): ${full} -> ${err2.message}`);
          continue;
        }
      }

      const hash = sha256(buf);
      if (seenHashes.has(hash)) {
        totalSkippedDup++;
        continue;
      }
      seenHashes.add(hash);

      const ext = extFromUrl(full);
      const filename = `${p.sku}-gallery-${n}.${ext}`;
      const destPath = path.join(OUT_DIR, filename);
      n++;

      try {
        await writeFileWithRetry(destPath, buf);
        const localUrl = `/uploads/products/${filename}`;
        newLocalPaths.push(localUrl);
        totalDownloaded++;
        console.log(`OK   ${p.name} (${p.sku}) -> ${filename} (${buf.length} bytes)`);
      } catch (err) {
        totalFailed++;
        failedDownloads.push(`${p.name} (${p.sku}): write ${filename} -> ${err.message}`);
      }
    }

    if (newLocalPaths.length > 0) {
      const updatedImages = [...existingUrls, ...newLocalPaths];
      await prisma.product.update({
        where: { id: p.id },
        data: { images: JSON.stringify(updatedImages) },
      });
      productsUpdated++;
    } else {
      skippedProducts.push(`${p.name} (${p.sku}) — no new non-duplicate images from ${pageUrl}`);
    }
  }

  console.log("\n================ SUMMARY ================");
  console.log(`Products updated with >=1 new image: ${productsUpdated}`);
  console.log(`Total images downloaded: ${totalDownloaded}`);
  console.log(`Total duplicate images skipped (content-matched): ${totalSkippedDup}`);
  console.log(`Total failed downloads: ${totalFailed}`);
  console.log(`\nSkipped products (${skippedProducts.length}):`);
  for (const s of skippedProducts) console.log(`  - ${s}`);
  console.log(`\nFailed downloads (${failedDownloads.length}):`);
  for (const f of failedDownloads) console.log(`  - ${f}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
