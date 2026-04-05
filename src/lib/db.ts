import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma_v4: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma_v4 ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v4 = prisma

export { prisma as db }
