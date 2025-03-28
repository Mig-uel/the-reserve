'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'

/**
 * Get Latest Products
 */
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  })

  return convertToPlainObject(data)
}

/**
 * Get Single Product By Slug
 */
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  })
}

/**
 * Get All Products
 * @access Admin
 */
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string
  limit?: number
  page: number
  category?: string
}) {
  const products = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })

  const productsCount = await prisma.product.count()

  return {
    products: convertToPlainObject(products),
    totalPages: Math.ceil(productsCount / limit),
  }
}
