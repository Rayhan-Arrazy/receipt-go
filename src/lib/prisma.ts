import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // During build time with no DATABASE_URL, create a client that will
    // fail at query time rather than at instantiation time.
    // This allows `next build` to succeed without a live database.
    console.warn("DATABASE_URL not set – Prisma queries will fail at runtime.");
    return new PrismaClient() as unknown as PrismaClient;
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
