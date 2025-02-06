'use server'

import { signIn, signOut } from '@/auth'
import { prisma } from '@/db/prisma'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { notFound } from 'next/navigation'
import { signInFormSchema } from './validators'

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

/** Sign in the user with credentials */
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      success: false,
      message: 'Invalid email or password',
    }
  }
}

/** Sign out user */
export async function signOutUser() {
  await signOut()
}
