'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatErrors } from '../utils'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  query,
  limit = PAGE_SIZE,
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

/**
 * Delete Product
 * @access Admin
 */
export async function deleteProduct(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  prevState: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
) {
  try {
    const session = await auth()

    // Check if the user is authenticated and has the admin role
    if (!session || !session.user || session.user.role !== 'admin')
      throw new Error('Unauthorized access')

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    })

    if (!product) throw new Error('Product not found')

    // Delete the product
    await prisma.product.delete({
      where: {
        id,
      },
    })

    // Delete the product image if it exists
    // TODO: Implement image deletion logic here

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
}
