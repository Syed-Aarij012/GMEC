import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma sizes its pool at (CPU count * 2 + 1) by default. On shared hosts
// that report dozens of CPUs this blows past the database's pooler limit
// (EMAXCONNSESSION). Cap it unless the URL already sets connection_limit.
function databaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url || /[?&]connection_limit=/.test(url)) return url;
  const limit = process.env.DATABASE_CONNECTION_LIMIT ?? "3";
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=${limit}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: databaseUrl() } } });

// Cache on globalThis in production too, so separate server bundles/entries
// share one client (and one pool) per process.
globalForPrisma.prisma = prisma;
