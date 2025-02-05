import { PrismaClient } from '@prisma/client'

// get latest products
export async function getLatestProducts() {
  const prisma = new PrismaClient()

  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }))
}
