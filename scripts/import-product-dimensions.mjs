import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const CSV_PATH = "D:/freelancing/GMEC/wc-product-export-4-9-2026-1788545728190.csv";

const prisma = new PrismaClient();

function toNumber(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

async function main() {
  const content = readFileSync(CSV_PATH, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const bySku = new Map();
  for (const row of records) {
    const sku = (row["SKU"] || "").trim();
    if (sku) bySku.set(sku, row);
  }

  const products = await prisma.product.findMany({ select: { id: true, sku: true, name: true } });

  let updated = 0;
  const stillMissing = [];

  for (const product of products) {
    let row = bySku.get(product.sku);
    let weightLbs = row ? toNumber(row["Weight (lbs)"]) : null;
    let lengthIn = row ? toNumber(row["Length (in)"]) : null;
    let widthIn = row ? toNumber(row["Width (in)"]) : null;
    let heightIn = row ? toNumber(row["Height (in)"]) : null;

    // Color variants (e.g. GMEC60-W) often have no dimensions of their own —
    // fall back to the base/parent SKU's row (e.g. GMEC60) if it has data.
    if (weightLbs === null && lengthIn === null && widthIn === null && heightIn === null) {
      const baseSku = product.sku.replace(/-[A-Z]$/, "");
      if (baseSku !== product.sku) {
        const parentRow = bySku.get(baseSku);
        if (parentRow) {
          weightLbs = toNumber(parentRow["Weight (lbs)"]);
          lengthIn = toNumber(parentRow["Length (in)"]);
          widthIn = toNumber(parentRow["Width (in)"]);
          heightIn = toNumber(parentRow["Height (in)"]);
        }
      }
    }

    if (weightLbs === null && lengthIn === null && widthIn === null && heightIn === null) {
      stillMissing.push({ sku: product.sku, name: product.name });
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { weightLbs, lengthIn, widthIn, heightIn },
    });
    updated++;
  }

  console.log(`Updated ${updated} of ${products.length} products.`);
  console.log(`${stillMissing.length} products have no weight/dimension data at all:`);
  for (const p of stillMissing) console.log(`  - ${p.sku}: ${p.name}`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
