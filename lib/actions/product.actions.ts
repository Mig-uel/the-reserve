'use server'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { InsertProductSchema, UpdateProductSchema } from '@/zod/validators'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants'
import { convertToPlainObject, formatErrors } from '../utils'

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
 * Get All Products
 * @access Admin
 */
export async function getAllProducts({
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
    orderBy: { createdAt: 'desc' },
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  })

  const productsCount = await prisma.product.count({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  })

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

/**
 * Create Product
 * @access Admin
 */
export async function createProduct(
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const imagesArray = JSON.parse(formData.get('images') as string)

    const product = InsertProductSchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: Number(formData.get('stock')),
      category: formData.get('category'),
      brand: formData.get('brand'),
      images: imagesArray,
      isFeatured: Boolean(formData.get('isFeatured')),
      banner: formData.get('banner') || null,
    })

    await prisma.product.create({
      data: product,
    })

    revalidatePath('/admin/products/create')
    revalidatePath('/admin/products')

    return redirect('/admin/products')
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
}

/**
 * Update Product
 * @access Admin
 */
export async function updateProduct(
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const product = UpdateProductSchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: Number(formData.get('stock')),
      id: formData.get('id'),
      images: JSON.parse(formData.get('images') as string),
      isFeatured: Boolean(formData.get('isFeatured')),
      banner: formData.get('banner') || null,
      category: formData.get('category'),
      brand: formData.get('brand'),
    })

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: formData.get('id') as string,
      },
    })

    if (!existingProduct) throw new Error('Product not found')

    await prisma.product.update({
      where: {
        id: formData.get('id') as string, // Updated to use formData.get('id')
      },
      data: product,
    })

    revalidatePath('/admin/products')

    return redirect('/admin/products')
  } catch (error) {
    // Check if the error is a redirect error and throw it to be handled by Next.js
    if (isRedirectError(error)) throw error
    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
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
 * Get Single Product By ID
 */
export async function getProductById(id: string) {
  return convertToPlainObject(
    await prisma.product.findFirst({
      where: {
        id,
      },
    })
  )
}
