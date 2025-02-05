import { prisma } from '@/db/prisma'
import { notFound } from 'next/navigation'

/** Get latest products */
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}

/** Get single product */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
  })

  if (!product) return notFound()

  return product
}
