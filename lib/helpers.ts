import { prisma } from '@/db/prisma'

// get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}
