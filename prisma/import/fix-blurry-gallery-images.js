// One-off fix: the GMEC32 / GMEC33 2D fluorescent bulb products had gallery
// images downloaded at WordPress's 150x150 thumbnail size instead of full
// resolution, so they render heavily upscaled/blurred as the main product
// image. This drops those tiny images from each product's `images` array,
// keeping only the properly-sized ones (>250px). Safe to re-run.
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function jpegSize(buf) {
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD8 || m === 0xD9) { i += 2; continue; }
    if (m >= 0xD0 && m <= 0xD7) { i += 2; continue; }
    if (m === 0x01 || m === 0x00) { i += 2; continue; }
    const len = buf.readUInt16BE(i + 2);
    if ((m >= 0xC0 && m <= 0xC3) || (m >= 0xC5 && m <= 0xC7) || (m >= 0xC9 && m <= 0xCB) || (m >= 0xCD && m <= 0xCF)) {
      return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    }
    i += 2 + len;
  }
  return null;
}
function pngSize(buf) {
  if (buf.slice(0, 8).toString("hex") !== "89504e470d0a1a0a") return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}
function webpSize(buf) {
  if (buf.slice(0, 4).toString("ascii") !== "RIFF" || buf.slice(8, 12).toString("ascii") !== "WEBP") return null;
  const t = buf.slice(12, 16).toString("ascii");
  if (t === "VP8 ") return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (t === "VP8X") return [1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)), 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))];
  if (t === "VP8L") { const b = buf.readUInt32LE(21); return [(b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1]; }
  return null;
}
function sizeOf(buf) {
  return pngSize(buf) || webpSize(buf) || jpegSize(buf);
}

const PUBLIC_DIR = path.join(__dirname, "..", "..", "public");

async function main() {
  const products = await prisma.product.findMany({
    where: { OR: [{ sku: { startsWith: "GMEC32" } }, { sku: { startsWith: "GMEC33" } }] },
  });

  for (const p of products) {
    const urls = JSON.parse(p.images);
    const kept = [];
    const dropped = [];
    for (const url of urls) {
      const abs = path.join(PUBLIC_DIR, url);
      let dims = null;
      try {
        dims = sizeOf(fs.readFileSync(abs));
      } catch {
        // file missing; keep as-is rather than silently dropping
      }
      if (dims && dims[0] <= 250 && dims[1] <= 250) {
        dropped.push(url);
      } else {
        kept.push(url);
      }
    }
    if (dropped.length > 0) {
      await prisma.product.update({ where: { id: p.id }, data: { images: JSON.stringify(kept) } });
      console.log(`${p.name} (${p.sku}): kept ${kept.length}, dropped ${dropped.length} blurry image(s)`);
    } else {
      console.log(`${p.name} (${p.sku}): nothing to drop`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
