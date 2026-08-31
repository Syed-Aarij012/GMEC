const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Target theme colours (from src/app/globals.css)
const GOLD = [240, 171, 30]; // --color-gold-500 #f0ab1e
const INK = [11, 20, 40]; // --color-ink-900 #0b1428

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (((g - b) / d) % 6);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

async function recolorRegion(data, width, height, channels, box, target) {
  const x0 = Math.floor(box.x0 * width);
  const x1 = Math.ceil(box.x1 * width);
  const y0 = Math.floor(box.y0 * height);
  const y1 = Math.ceil(box.y1 * height);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const [h, s] = rgbToHsv(r, g, b);
      if (h < 280 || h > 355) continue;
      const w = smoothstep(0.08, 0.35, s);
      if (w <= 0) continue;
      data[idx] = Math.round(r * (1 - w) + target[0] * w);
      data[idx + 1] = Math.round(g * (1 - w) + target[1] * w);
      data[idx + 2] = Math.round(b * (1 - w) + target[2] * w);
    }
  }
}

function writeWithRetry(filePath, buffer) {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      fs.writeFileSync(filePath, buffer);
      return;
    } catch (err) {
      if (err.code !== "EPERM" && err.code !== "EBUSY" && err.code !== "UNKNOWN") throw err;
    }
  }
  throw new Error(`gave up writing ${filePath} after 10 attempts`);
}

async function processFile(filePath, boxes) {
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  for (const box of boxes) {
    await recolorRegion(data, width, height, channels, box, box.target);
  }

  const ext = path.extname(filePath).toLowerCase();
  const pipeline = sharp(data, { raw: { width, height, channels } });
  const outBuffer =
    ext === ".webp"
      ? await pipeline.webp({ quality: 92 }).toBuffer()
      : await pipeline.png({ compressionLevel: 9 }).toBuffer();
  writeWithRetry(filePath, outBuffer);
  console.log(`Recoloured ${filePath}`);
}

const PILL_BOX = { x0: 0, x1: 0.32, y0: 0, y1: 0.19, target: INK };
const TEXT_BOX = { x0: 0, x1: 0.58, y0: 0.19, y1: 0.6, target: GOLD };

const HERO_DIR = path.join(__dirname, "..", "..", "public", "hero");
const files = [
  "gu10-lights.webp",
  "e27-lights.png",
  "candle-bulbs.png",
  "downlights.png",
  "security-alarms.webp",
  "b22-bulbs.png",
];

async function main() {
  for (const f of files) {
    await processFile(path.join(HERO_DIR, f), [PILL_BOX, TEXT_BOX]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
