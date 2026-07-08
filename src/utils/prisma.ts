import { PrismaClient } from '@/generated/mydb';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

globalForPrisma.prisma = prisma;

export default prisma;