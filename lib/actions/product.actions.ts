'use server'
import { PrismaClient } from '@prisma/client'

/**
 * Get latest products
 */
export async function getLatestProducts(limit = 4) {
  const prisma = new PrismaClient()

  const data = await prisma.product.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  return data
}
