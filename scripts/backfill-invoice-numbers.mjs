// Assigns "GMEC - {year} - {number}" invoice numbers to orders that have none
// (e.g. recovered orders), continuing each year's InvoiceSequence.
//
//   node scripts/backfill-invoice-numbers.mjs          # dry run, prints the plan
//   node scripts/backfill-invoice-numbers.mjs --apply  # writes to the database
import { PrismaClient } from "@prisma/client";

const APPLY = process.argv.includes("--apply");
const FIRST_NUMBER = 6001;

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    where: { invoiceNumber: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true },
  });

  if (orders.length === 0) {
    console.log("No orders without an invoice number.");
    return;
  }

  const sequences = await prisma.invoiceSequence.findMany();
  const next = new Map(sequences.map((s) => [s.year, s.nextNumber]));
  const plan = [];

  for (const order of orders) {
    const year = order.createdAt.getUTCFullYear();
    const number = next.get(year) ?? FIRST_NUMBER;
    next.set(year, number + 1);
    plan.push({
      id: order.id,
      year,
      invoiceNumber: `GMEC - ${year} - ${String(number).padStart(4, "0")}`,
    });
  }

  console.log(`${plan.length} order(s) to update:`);
  for (const p of plan) console.log(`  ${p.id}  ->  ${p.invoiceNumber}`);

  if (!APPLY) {
    console.log("\nDry run only. Re-run with --apply to write these changes.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const p of plan) {
      await tx.order.update({ where: { id: p.id }, data: { invoiceNumber: p.invoiceNumber } });
    }
    for (const [year, nextNumber] of next) {
      await tx.invoiceSequence.upsert({
        where: { year },
        create: { year, nextNumber },
        update: { nextNumber },
      });
    }
  });
  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
