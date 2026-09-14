const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const CSV_PATH = path.join(__dirname, "wc-products.csv");

// The source site's own tagging is inconsistent (e.g. a "Filament Bulb" is
// sometimes cross-tagged under the Candle Bulbs collection too, and some
// candle-shaped bulbs were never tagged "candle" at all). To resolve this
// deterministically:
//   1. If the product NAME itself names a bulb shape, that wins outright —
//      it's a stronger signal than a cross-tag from the old site.
//   2. Otherwise use whichever fixture/type tag (name or real category tag)
//      identifies it.
//   3. Otherwise fall back to a bulb shape found only in the real tag text.
//   4. Otherwise fall back to the Cool/Warm White colour-temperature bucket.
const SHAPE_RULES = [
  [/candle bulb/i, "led-candle-bulbs"],
  [/filament bulb/i, "led-filament-bulbs"],
  [/frosted bulb/i, "led-frosted-bulbs"],
];

const TYPE_RULES = [
  [/ceiling light/i, "led-ceiling-lights"],
  [/rgb/i, "led-rgb-lights"],
  [/3 colours? in 1/i, "led-3-colours-in-1"],
  [/downlight/i, "gu10-downlights"],
  [/smart gadgets|security alarm|smart scales|comming soon/i, "smart-gadgets"],
];

const COLOUR_RULES = [
  [/cool white color/i, "led-cool-white-bulbs"],
  [/warm white color/i, "led-warm-white-bulbs"],
];

function resolveCategorySlug(categoriesRaw, name, fitting) {
  for (const [re, slug] of SHAPE_RULES) {
    if (re.test(name)) return slug;
  }
  for (const [re, slug] of TYPE_RULES) {
    if (re.test(name) || re.test(categoriesRaw)) return slug;
  }
  for (const [re, slug] of SHAPE_RULES) {
    if (re.test(categoriesRaw)) return slug;
  }
  for (const [re, slug] of COLOUR_RULES) {
    if (re.test(categoriesRaw)) return slug;
  }
  if (fitting === "GU10") return "gu10-downlights";
  return "led-frosted-bulbs";
}

function extractFitting(name) {
  const m = name.match(/\b(GU10|E14|E27|B22|GR8|GR10Q)\b/i);
  return m ? m[1].toUpperCase() : null;
}

async function main() {
  const csvText = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parse(csvText, { columns: true, skip_empty_lines: true, relax_column_count: true });

  const byId = new Map();
  const bySku = new Map();
  const byName = new Map();
  for (const r of rows) {
    byId.set(r.ID, r);
    if (r.SKU) bySku.set(r.SKU, r);
    if (r.Name) byName.set(r.Name.trim(), r);
  }

  const categories = await prisma.category.findMany();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const catById = Object.fromEntries(categories.map((c) => [c.id, c.slug]));

  const products = await prisma.product.findMany({ select: { id: true, sku: true, name: true, categoryId: true } });

  let changed = 0;
  let unchanged = 0;
  let notFoundInCsv = 0;
  const changes = [];

  for (const p of products) {
    let row = bySku.get(p.sku);
    if (!row) {
      // try stripping our uniqueness suffixes like "-2" appended during import
      const base = p.sku.replace(/-\d+$/, "");
      row = bySku.get(base);
    }
    if (!row) {
      // rows with no real SKU in the source CSV: match by exact product name instead
      row = byName.get(p.name);
    }
    if (!row) {
      notFoundInCsv++;
      continue;
    }

    let categoriesRaw = row.Categories || "";
    let parentRow = null;
    if (row.Type === "variation") {
      const parentRef = row.Parent || "";
      if (parentRef.startsWith("id:")) parentRow = byId.get(parentRef.slice(3));
      else if (parentRef) parentRow = bySku.get(parentRef);
      if (parentRow) categoriesRaw = parentRow.Categories || categoriesRaw;
    }

    const rowName = row.Name || p.name;
    const fitting = extractFitting(rowName);
    const newSlug = resolveCategorySlug(categoriesRaw, rowName, fitting);
    const newCategoryId = catBySlug[newSlug];
    if (!newCategoryId) continue;

    const oldSlug = catById[p.categoryId];
    if (newCategoryId !== p.categoryId) {
      changes.push({ name: p.name, sku: p.sku, from: oldSlug, to: newSlug });
      await prisma.product.update({ where: { id: p.id }, data: { categoryId: newCategoryId } });
      changed++;
    } else {
      unchanged++;
    }
  }

  console.log(`Changed: ${changed}, Unchanged: ${unchanged}, Not found in CSV: ${notFoundInCsv}`);
  console.log("\nChanges:");
  for (const c of changes) {
    console.log(`  [${c.from} -> ${c.to}]  ${c.name} (${c.sku})`);
  }

  console.log("\nFinal category counts:");
  const byCat = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  for (const c of byCat) console.log(`  ${c.slug}: ${c._count.products}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
