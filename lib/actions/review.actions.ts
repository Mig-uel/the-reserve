'use server'

import { auth } from '@/auth'
import { formatErrors } from '../utils'
import { InsertReviewSchema } from '@/zod/validators'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Create and Update Review
 */
export async function createUpdateReview(
  productId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const session = await auth()
    if (!session || !session.user)
      throw new Error('Must be logged in to leave a review')

    const review = InsertReviewSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      rating: Number(formData.get('rating')),
      productId,
      userId: session.user.id,
    })

    const product = await prisma.product.findFirst({
      where: { id: productId },
    })

    if (!product) throw new Error('Product not found')

    // check if user already left a review
    const reviewed = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    await prisma.$transaction(async (tx) => {
      if (reviewed) {
        // update review
        await tx.review.update({
          where: { id: reviewed.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        })
      } else {
        // create review
        await tx.review.create({
          data: review,
        })
      }

      // get average rating
      const averageRating = await tx.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          productId,
        },
      })

      // get number of reviews
      const numReviews = await tx.review.count({
        where: {
          productId,
        },
      })

      // update the rating and number of reviews in the product
      await tx.product.update({
        where: { id: productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      })
    })

    revalidatePath(`/product/${product.slug}`)

    return {
      message: reviewed
        ? 'Review updated successfully'
        : 'Review created successfully',
      success: true,
    }
  } catch (error) {
    console.error(error)

    return {
      message: formatErrors(error as Error),
      success: false,
    }
  }
}

/**
 * Get All Reviews for a Product
 * @param productId - Product ID
 */
export async function getAllReviews(productId: string) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  return data
}

/**
 * Get Review Written by the User for a Product
 * @param productId - Product ID
 */
export async function getUserReview(productId: string) {
  const session = await auth()

  if (!session || !session.user) return null

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  })
}
