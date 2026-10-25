import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton. All database access goes through this instance
 * (and the repo helpers in this folder) — never construct PrismaClient
 * elsewhere, and never issue raw SQL.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
