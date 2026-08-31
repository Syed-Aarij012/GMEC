const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const GOLD = [240, 171, 30];
const INK = [11, 20, 40];
const TOL = 20; // per-channel tolerance for "close enough to this target colour"

function close(r, g, b, target) {
  return (
    Math.abs(r - target[0]) <= TOL &&
    Math.abs(g - target[1]) <= TOL &&
    Math.abs(b - target[2]) <= TOL
  );
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

// Fixes the case where an earlier recolour pass already ran on this file and
// mis-split the badge pill (part ink, part wrongly left/turned gold) because
// its detection missed part of the pill that faded to a lower-saturation
// pink. This works on ALREADY-recoloured files with no source pink left: it
// flood-fills from an ink seed through the connected ink+gold blob (the pill
// is always contiguous, and nothing else touches it up there) and repaints
// any gold it finds inside that blob back to ink.
async function processFile(filePath) {
  const img = sharp(filePath);
  const meta = await img.metadata();
  const { width, height } = meta;
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;

  const seedX = Math.round(0.03 * width);
  const seedY = Math.round(0.06 * height);
  const maxX = Math.round(0.55 * width);
  const maxY = Math.round(0.35 * height);

  function pixelAt(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], idx];
  }

  const [sr, sg, sb] = pixelAt(seedX, seedY);
  if (!close(sr, sg, sb, INK)) return false; // no ink pill here (or nothing to patch)

  const visited = new Uint8Array(width * height);
  const stack = [[seedX, seedY]];
  visited[seedY * width + seedX] = 1;
  const goldPixelIdx = [];

  while (stack.length) {
    const [x, y] = stack.pop();
    const [r, g, b, idx] = pixelAt(x, y);
    if (close(r, g, b, GOLD)) goldPixelIdx.push(idx);
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= maxX || ny >= maxY) continue;
      const key = ny * width + nx;
      if (visited[key]) continue;
      visited[key] = 1;
      const [nr, ng, nb] = pixelAt(nx, ny);
      if (close(nr, ng, nb, INK) || close(nr, ng, nb, GOLD)) stack.push([nx, ny]);
    }
  }

  if (goldPixelIdx.length === 0) return false;

  for (const idx of goldPixelIdx) {
    data[idx] = INK[0];
    data[idx + 1] = INK[1];
    data[idx + 2] = INK[2];
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
  let patched = 0;
  for (const f of files) {
    try {
      const result = await processFile(path.join(PRODUCTS_DIR, f));
      if (result) {
        patched++;
        console.log(`Patched ${f}${path.basename(result) !== f ? " -> " + path.basename(result) : ""}`);
      }
    } catch (err) {
      console.error(`FAILED ${f}: ${err.message}`);
    }
  }
  console.log(`\nDone. Patched ${patched}/${files.length} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
