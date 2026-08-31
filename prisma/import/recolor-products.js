const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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

// The logo pill's width varies between template variants (some ~32% of the
// image width, some ~36%+), so a fixed fraction cuts some of them in half —
// half the pill lands "ink", half lands "gold". Instead, flood-fill outward
// from a seed pixel that's always inside the pill (near the top-left corner)
// through connected strongly-pink pixels to find its real bounding box, then
// pad it a little to cover the anti-aliased edge.
function findPillBox(data, width, height, channels) {
  const seedX = Math.round(0.03 * width);
  const seedY = Math.round(0.06 * height);
  const maxX = Math.round(0.55 * width);
  const maxY = Math.round(0.35 * height);

  function strongPink(x, y) {
    const idx = (y * width + x) * channels;
    const [h, s] = rgbToHsv(data[idx], data[idx + 1], data[idx + 2]);
    // Some template variants fade the pill to a lighter/lower-saturation
    // pink toward one end (a gradient fill) rather than staying fully
    // saturated edge to edge, so the flood fill needs a fairly low bar to
    // stay connected all the way across — the hue gate alone (no other pink
    // content sits up here) is enough to avoid false connections.
    return h >= 280 && h <= 355 && s >= 0.12;
  }

  if (!strongPink(seedX, seedY)) return null;

  const visited = new Uint8Array(width * height);
  const stack = [[seedX, seedY]];
  visited[seedY * width + seedX] = 1;
  let minX = seedX, maxXFound = seedX, minY = seedY, maxYFound = seedY;

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < minX) minX = x;
    if (x > maxXFound) maxXFound = x;
    if (y < minY) minY = y;
    if (y > maxYFound) maxYFound = y;
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= maxX || ny >= maxY) continue;
      const key = ny * width + nx;
      if (visited[key]) continue;
      visited[key] = 1;
      if (strongPink(nx, ny)) stack.push([nx, ny]);
    }
  }

  const padX = Math.round(0.01 * width);
  const padY = Math.round(0.01 * height);
  return {
    x0: Math.max(0, minX - padX),
    x1: Math.min(width, maxXFound + padX),
    y0: Math.max(0, minY - padY),
    y1: Math.min(height, maxYFound + padY),
  };
}

// Returns the path actually written to: filePath itself, or — if it's
// locked by something (the Next dev server holding these particular files
// open persistently) — a new sibling file so the caller can point the DB
// at the recoloured copy instead of waiting forever on a lock that never
// clears.
async function writeWithRetry(filePath, buffer) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (err) {
      if (err.code !== "EPERM" && err.code !== "EBUSY" && err.code !== "UNKNOWN") throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  const ext = path.extname(filePath);
  const altPath = filePath.slice(0, -ext.length) + "-gold" + ext;
  fs.writeFileSync(altPath, buffer);
  return altPath;
}

// The "Trusted British Brand" shield/flag icon sits in this bottom-left
// corner across every template. It must never be recoloured — it's a flag,
// not brand styling, so whatever colour (including any decorative accent
// line traced around it) it already has stays exactly as-is.
const SHIELD_BOX = { x0: 0.03, x1: 0.135, y0: 0.82, y1: 0.98 };

function inShieldBox(x, y, width, height) {
  return (
    x >= SHIELD_BOX.x0 * width &&
    x < SHIELD_BOX.x1 * width &&
    y >= SHIELD_BOX.y0 * height &&
    y < SHIELD_BOX.y1 * height
  );
}

async function processFile(filePath) {
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  let anyPink = false;
  for (let i = 0; i < data.length && !anyPink; i += channels) {
    const [h, s] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    if (h >= 280 && h <= 355 && s >= 0.12) anyPink = true;
  }
  if (!anyPink) return false;

  const pillBox = findPillBox(data, width, height, channels);

  let touched = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const [h, s] = rgbToHsv(r, g, b);
      if (h < 280 || h > 355 || s < 0.12) continue;
      if (inShieldBox(x, y, width, height)) continue;
      // Full snap rather than a partial blend: a partial blend can leave a
      // pixel's hue still just inside the pink range, which then gets
      // "detected" again on a re-run and drifts a little further each time
      // instead of converging in one pass.
      const inPill =
        pillBox && x >= pillBox.x0 && x < pillBox.x1 && y >= pillBox.y0 && y < pillBox.y1;
      const target = inPill ? INK : GOLD;
      data[idx] = target[0];
      data[idx + 1] = target[1];
      data[idx + 2] = target[2];
      touched++;
    }
  }

  if (touched === 0) return false;

  const ext = path.extname(filePath).toLowerCase();
  const pipeline = sharp(data, { raw: { width, height, channels } });
  let outBuffer;
  if (ext === ".webp") {
    // Lossless: a lossy re-encode can introduce a few stray off-hue pixels
    // at the new hard block edges, which then register as "pink" again on
    // the next rescan and the file never stops changing between runs.
    outBuffer = await pipeline.webp({ lossless: true }).toBuffer();
  } else if (ext === ".jpg" || ext === ".jpeg") {
    outBuffer = await pipeline.jpeg({ quality: 92 }).toBuffer();
  } else {
    outBuffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  }
  const writtenPath = await writeWithRetry(filePath, outBuffer);
  return writtenPath;
}

const PRODUCTS_DIR = path.join(__dirname, "..", "..", "public", "uploads", "products");

async function main() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  let changed = 0;
  const renamed = [];
  for (const f of files) {
    try {
      const writtenPath = await processFile(path.join(PRODUCTS_DIR, f));
      if (writtenPath) {
        changed++;
        const writtenName = path.basename(writtenPath);
        if (writtenName !== f) {
          renamed.push({ old: f, new: writtenName });
          console.log(`Recoloured ${f} -> ${writtenName} (original was locked)`);
        } else {
          console.log(`Recoloured ${f}`);
        }
      }
    } catch (err) {
      console.error(`FAILED ${f}: ${err.message}`);
    }
  }
  if (renamed.length) {
    fs.writeFileSync(
      path.join(__dirname, "renamed-images.json"),
      JSON.stringify(renamed, null, 2)
    );
    console.log(`\nWrote ${renamed.length} rename(s) to renamed-images.json for the DB update step.`);
  }
  console.log(`\nDone. ${changed}/${files.length} images had pink recoloured.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
