const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, slug: true, images: true },
    orderBy: { name: "asc" },
  });
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}
main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
