const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

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

// A hue/saturation gate rather than a fixed RGB distance: the hatching's
// edges are gold blended with red or white underneath (anti-aliasing, or a
// semi-transparent overlay in the source), so the exact RGB drifts a lot
// while the hue stays close to gold's ~40°.
function isGoldish(r, g, b) {
  const [h, s] = rgbToHsv(r, g, b);
  return h >= 20 && h <= 55 && s >= 0.35;
}

function writeWithRetry(filePath, buffer) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (err) {
      if (err.code !== "EPERM" && err.code !== "EBUSY" && err.code !== "UNKNOWN") throw err;
    }
  }
  const ext = path.extname(filePath);
  const altPath = filePath.slice(0, -ext.length) + "-gold" + ext;
  fs.writeFileSync(altPath, buffer);
  return altPath;
}

// Some templates had a wider hatched/diagonal-stripe pink texture across the
// flag icon (not just a thin trim line), which the earlier single-pass
// nearest-neighbour heal (small fixed radius) couldn't fully reach. This
// instead floods good colour inward from the edges of the masked area,
// iteration by iteration, until every masked pixel has been filled —
// handles a gap of any width/shape, not just a thin line.
const SHIELD_BOX = { x0: 0.02, x1: 0.135, y0: 0.81, y1: 0.99 };

async function processFile(filePath) {
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  const x0 = Math.floor(SHIELD_BOX.x0 * width);
  const x1 = Math.ceil(SHIELD_BOX.x1 * width);
  const y0 = Math.floor(SHIELD_BOX.y0 * height);
  const y1 = Math.ceil(SHIELD_BOX.y1 * height);
  const boxW = x1 - x0;
  const boxH = y1 - y0;

  const mask = new Uint8Array(boxW * boxH);
  let anyMasked = false;
  for (let y = 0; y < boxH; y++) {
    for (let x = 0; x < boxW; x++) {
      const idx = ((y0 + y) * width + (x0 + x)) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (isGoldish(r, g, b)) {
        mask[y * boxW + x] = 1;
        anyMasked = true;
      }
    }
  }
  if (!anyMasked) return false;

  let remaining = true;
  let iterations = 0;
  while (remaining && iterations < 60) {
    remaining = false;
    iterations++;
    for (let y = 0; y < boxH; y++) {
      for (let x = 0; x < boxW; x++) {
        if (!mask[y * boxW + x]) continue;
        let sr = 0, sg = 0, sb = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= boxW || ny >= boxH) continue;
            if (mask[ny * boxW + nx]) continue;
            const idx = ((y0 + ny) * width + (x0 + nx)) * channels;
            sr += data[idx]; sg += data[idx + 1]; sb += data[idx + 2];
            n++;
          }
        }
        if (n > 0) {
          const idx = ((y0 + y) * width + (x0 + x)) * channels;
          data[idx] = Math.round(sr / n);
          data[idx + 1] = Math.round(sg / n);
          data[idx + 2] = Math.round(sb / n);
          mask[y * boxW + x] = 0; // filled — treat as source for the next ring
        } else {
          remaining = true;
        }
      }
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const pipeline = sharp(data, { raw: { width, height, channels } });
  let outBuffer;
  if (ext === ".webp") {
    outBuffer = await pipeline.webp({ lossless: true }).toBuffer();
  } else if (ext === ".jpg" || ext === ".jpeg") {
    outBuffer = await pipeline.jpeg({ quality: 92 }).toBuffer();
  } else {
    outBuffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  }
  return writeWithRetry(filePath, outBuffer);
}

const PRODUCTS_DIR = path.join(__dirname, "..", "..", "public", "uploads", "products");

async function main() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  let fixed = 0;
  const renamed = [];
  for (const f of files) {
    try {
      const result = await processFile(path.join(PRODUCTS_DIR, f));
      if (result) {
        fixed++;
        const writtenName = path.basename(result);
        if (writtenName !== f) renamed.push({ old: f, new: writtenName });
        console.log(`Healed flag: ${f}${writtenName !== f ? " -> " + writtenName : ""}`);
      }
    } catch (err) {
      console.error(`FAILED ${f}: ${err.message}`);
    }
  }
  if (renamed.length) {
    const rp = path.join(__dirname, "renamed-images.json");
    const existing = fs.existsSync(rp) ? JSON.parse(fs.readFileSync(rp, "utf8")) : [];
    fs.writeFileSync(rp, JSON.stringify([...existing, ...renamed], null, 2));
    console.log(`\nWrote ${renamed.length} additional rename(s) to renamed-images.json.`);
  }
  console.log(`\nDone. Healed ${fixed}/${files.length} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
