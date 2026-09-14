const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CSV_PATH = path.join(__dirname, "wc-products.csv");

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function extractFitting(name) {
  const m = name.match(/\b(GU10|E14|E27|B22|GR8|GR10Q)\b/i);
  return m ? m[1].toUpperCase() : null;
}

function extractWattage(name) {
  const m = name.match(/(\d+(?:\.\d+)?)\s?W\b/i);
  return m ? `${m[1]}W` : null;
}

function extractColour(name, categories) {
  const hay = `${name} ${categories}`.toLowerCase();
  if (hay.includes("3 colour") || hay.includes("3 colours")) return "3 Colours in 1";
  if (hay.includes("warm white")) return "Warm White";
  if (hay.includes("cool white")) return "Cool White";
  if (hay.includes("daylight")) return "Daylight";
  return null;
}

// Priority-ordered keyword -> category slug mapping
const CATEGORY_RULES = [
  [/candle/i, "led-candle-bulbs"],
  [/filament/i, "led-filament-bulbs"],
  [/frosted/i, "led-frosted-bulbs"],
  [/panel light|ceiling light|bulkhead|2d fluorescent|surface mounted/i, "led-ceiling-lights"],
  [/3 colours? in 1|rgb/i, "led-3-colours-in-1"],
  [/downlight/i, "gu10-downlights"],
  [/smart gadgets|security alarm|smart scale|luggage scale|handheld fan|smoke|carbon monoxide|comming soon|gas leak/i, "smart-gadgets"],
];

function resolveCategorySlug(categoriesRaw, name, fitting) {
  const hay = `${categoriesRaw} ${name}`;
  for (const [re, slug] of CATEGORY_RULES) {
    if (re.test(hay)) return slug;
  }
  const colourHay = hay.toLowerCase();
  if (colourHay.includes("cool white")) return "led-cool-white-bulbs";
  if (colourHay.includes("warm white")) return "led-warm-white-bulbs";
  if (fitting === "GU10") return "gu10-downlights";
  return "led-frosted-bulbs";
}

function buildDescription({ name, fitting, wattage, colour }) {
  const parts = [];
  parts.push(`${name}.`);
  const specs = [];
  if (fitting) specs.push(`${fitting} fitting`);
  if (wattage) specs.push(`${wattage}`);
  if (colour) specs.push(colour.toLowerCase());
  if (specs.length) parts.push(`Features ${specs.join(", ")}.`);
  parts.push("Energy-efficient LED lighting from GMEC, built for reliable everyday performance with free UK delivery on orders over £100 +VAT.");
  return parts.join(" ");
}

function parseImages(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((url) => url.replace(/\?wsr$/, ""));
}

async function main() {
  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parse(csvText, { columns: true, skip_empty_lines: true, relax_column_count: true });

  const categories = await prisma.category.findMany();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // Index rows by ID and by SKU for variation->parent lookup
  const byId = new Map();
  const bySku = new Map();
  for (const r of rows) {
    byId.set(r.ID, r);
    if (r.SKU) bySku.set(r.SKU, r);
  }

  const existingSlugs = new Set((await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug));
  const existingSkus = new Set((await prisma.product.findMany({ select: { sku: true } })).map((p) => p.sku));

  function uniqueSlug(base) {
    let slug = base;
    let i = 2;
    while (existingSlugs.has(slug)) {
      slug = `${base}-${i}`;
      i++;
    }
    existingSlugs.add(slug);
    return slug;
  }

  function uniqueSku(base) {
    let sku = base;
    let i = 2;
    while (existingSkus.has(sku)) {
      sku = `${base}-${i}`;
      i++;
    }
    existingSkus.add(sku);
    return sku;
  }

  const toCreate = [];
  let skippedParents = 0;
  let skippedNoPrice = 0;

  for (const r of rows) {
    if (r.Type === "variable") {
      skippedParents++;
      continue; // parent row itself is not a purchasable product
    }

    let parentRow = null;
    if (r.Type === "variation") {
      const parentRef = r.Parent || "";
      if (parentRef.startsWith("id:")) {
        parentRow = byId.get(parentRef.slice(3));
      } else if (parentRef) {
        parentRow = bySku.get(parentRef);
      }
    }

    const name = r.Name && r.Name.trim();
    if (!name) continue;

    const regular = parseFloat(r["Regular price"]);
    const sale = parseFloat(r["Sale price"]);
    let price, compareAtPrice;
    if (!isNaN(sale) && sale > 0) {
      price = sale;
      compareAtPrice = !isNaN(regular) && regular > sale ? regular : null;
    } else if (!isNaN(regular) && regular > 0) {
      price = regular;
      compareAtPrice = null;
    } else {
      skippedNoPrice++;
      continue; // no usable price (e.g. parent-only or unpriced draft)
    }

    const categoriesRaw = r.Categories || (parentRow ? parentRow.Categories : "") || "";
    const fitting = extractFitting(name) || (parentRow ? extractFitting(parentRow.Name) : null);
    const wattage = extractWattage(name) || (parentRow ? extractWattage(parentRow.Name) : null);
    const colour = extractColour(name, categoriesRaw);

    const categorySlug = resolveCategorySlug(categoriesRaw, name, fitting);
    const categoryId = catBySlug[categorySlug];
    if (!categoryId) continue;

    let images = parseImages(r.Images);
    if (!images.length && parentRow) images = parseImages(parentRow.Images);
    if (!images.length) continue;

    const skuBase = (r.SKU && r.SKU.trim()) || slugify(name).slice(0, 40).toUpperCase().replace(/-/g, "");
    const sku = uniqueSku(skuBase);
    const slug = uniqueSlug(slugify(name));

    const featured = r["Is featured?"] === "1";

    toCreate.push({
      slug,
      name,
      description: buildDescription({ name, fitting, wattage, colour }),
      price,
      compareAtPrice,
      images: JSON.stringify(images),
      stock: 100,
      featured,
      fitting,
      wattage,
      colour,
      sku,
      categoryId,
    });
  }

  console.log(`Rows parsed: ${rows.length}`);
  console.log(`Skipped variable-parent rows: ${skippedParents}`);
  console.log(`Skipped rows with no usable price: ${skippedNoPrice}`);
  console.log(`Products to create: ${toCreate.length}`);

  let created = 0;
  for (const data of toCreate) {
    await prisma.product.create({ data });
    created++;
  }

  console.log(`Created ${created} products.`);

  const byCat = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  for (const c of byCat) {
    console.log(`${c.slug}: ${c._count.products} products`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
