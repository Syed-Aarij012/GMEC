const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const GOLD = [240, 171, 30];
const INK = [11, 20, 40];
const TOL = 25;

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

// The "Trusted British Brand" shield icon sits in the bottom-left corner of
// every product template. It must never be recoloured — it's a flag, its
// colours are fixed regardless of the site's theme. Some template variants
// had a thin decorative dashed line traced around the flag's shapes as part
// of the same brand-pink accent used elsewhere, which earlier passes
// (correctly, by the letter of "recolour the brand pink") turned gold. That
// reads as broken here specifically, so instead of recolouring that trim,
// this heals it away: any gold/ink pixel inside the shield's bounding box is
// replaced with the nearest pixel color that isn't gold/ink, so the dash
// blends back into whatever flag colour (or white background) it was
// sitting on top of.
const SHIELD_BOX = { x0: 0.03, x1: 0.15, y0: 0.82, y1: 0.98 };

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

  function isTrim(x, y) {
    const idx = (y * width + x) * channels;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    return close(r, g, b, GOLD) || close(r, g, b, INK);
  }

  const toFix = [];
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (isTrim(x, y)) toFix.push([x, y]);
    }
  }
  if (toFix.length === 0) return false;

  for (const [x, y] of toFix) {
    let found = null;
    for (let radius = 1; radius <= 10 && !found; radius++) {
      for (let dy = -radius; dy <= radius && !found; dy++) {
        for (let dx = -radius; dx <= radius && !found; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < x0 || nx >= x1 || ny < y0 || ny >= y1) continue;
          if (!isTrim(nx, ny)) {
            const idx = (ny * width + nx) * channels;
            found = [data[idx], data[idx + 1], data[idx + 2]];
          }
        }
      }
    }
    if (found) {
      const idx = (y * width + x) * channels;
      data[idx] = found[0];
      data[idx + 1] = found[1];
      data[idx + 2] = found[2];
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
        console.log(`Fixed flag trim: ${f}${writtenName !== f ? " -> " + writtenName : ""}`);
      }
    } catch (err) {
      console.error(`FAILED ${f}: ${err.message}`);
    }
  }
  if (renamed.length) {
    const existing = fs.existsSync(path.join(__dirname, "renamed-images.json"))
      ? JSON.parse(fs.readFileSync(path.join(__dirname, "renamed-images.json"), "utf8"))
      : [];
    const merged = [...existing, ...renamed];
    fs.writeFileSync(path.join(__dirname, "renamed-images.json"), JSON.stringify(merged, null, 2));
    console.log(`\nWrote ${renamed.length} additional rename(s) to renamed-images.json.`);
  }
  console.log(`\nDone. Fixed ${fixed}/${files.length} files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
