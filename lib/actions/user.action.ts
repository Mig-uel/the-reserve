'use server'

// TODO: simplify returns (return redirect instead of returning message on success)

import { auth, signIn, signOut, update } from '@/auth'
import { prisma } from '@/db/prisma'
import {
  PaymentMethodsSchema,
  ShippingAddressSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UpdateUserProfileSchema,
  UpdateUserSchema,
} from '@/zod/validators'
import { hashSync } from 'bcrypt-ts-edge'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatErrors } from '../utils'

import type { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PAGE_SIZE } from '../constants'
import { getUserCart } from './cart.actions'

/**
 * Sign In User with Credentials
 */
export async function signInWithCredentials(
  callbackUrl: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return {
      success: true,
      message: `Sign in successful`,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      success: false,
      message: 'Invalid email or password',
      email: formData.get('email'),
    }
  }
}

/**
 * Sign Out User
 */
export async function signOutUser() {
  // get current users cart and delete it so it doesn't persist after sign out
  const currentCart = await getUserCart()
  await prisma.cart.deleteMany({
    where: {
      id: currentCart?.id,
    },
  })

  // sign out user
  await signOut()
}

/**
 * Sign Up User
 */
export async function signUpUser(
  callbackUrl: string,
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    const plainPassword = user.password
    user.password = hashSync(user.password)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    })

    return {
      message: 'Registration successful',
      success: true,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error

    if (error instanceof Error)
      return {
        success: false,
        message: formatErrors(error),
      }
  }
}

/**
 * Get User By Id
 */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

/**
 * Update User's Address
 */
export async function updateUserAddress(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const session = await auth()

    if (!session || !session.user) throw new Error('Must be signed in first')

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id as string,
      },
    })

    if (!user) throw new Error('User not found')

    const address = ShippingAddressSchema.parse({
      fullName: formData.get('fullName'),
      streetAddress: formData.get('streetAddress'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country'),
    })

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        address,
      },
    })

    revalidatePath('/shipping')

    return redirect('/payment')
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      message: formatErrors(error as Error),
      success: false,
    }
  }
}

/**
 * Update User's Payment Method
 */
export async function updateUserPaymentMethod(formData: FormData) {
  try {
    const session = await auth()

    if (!session || !session.user) throw new Error('Must be signed in first')

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id as string,
      },
    })

    if (!user) throw new Error('User not found')

    const paymentMethod = PaymentMethodsSchema.parse({
      type: formData.get('paymentMethod'),
    })

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    })

    revalidatePath('/payment')

    return redirect('/place-order')
  } catch (error) {
    if (isRedirectError(error)) throw error

    console.log(error)
  }
}

/**
 * Update User's Profile
 */
export async function updateUserProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const session = await auth()

    if (!session || !session.user) throw new Error('Must be signed in first')

    const userObject = UpdateUserProfileSchema.parse({
      name: formData.get('name'),
      email: session.user.email,
    })

    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    })

    if (!user) throw new Error('User not found')

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: userObject.name,
        // email: formData.get('email') as string,
      },
    })

    await update({
      user: {
        name: userObject.name,
      },
    })

    revalidatePath('/user/profile')

    return {
      message: 'Profile updated successfully',
      success: true,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      message: formatErrors(error as Error),
      success: false,
    }
  }
}

/**
 * Get All Users
 */
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query = '',
}: {
  limit?: number
  page: number
  query?: string
}) {
  const queryFilter: Prisma.UserWhereInput =
    query.trim() && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {}

  const users = await prisma.user.findMany({
    where: {
      // filter by name
      ...queryFilter,
    },
    orderBy: {
      createdAt: 'desc',
    },

    take: limit,
    skip: (page - 1) * limit,
  })

  const total = await prisma.user.count()
  const totalPages = Math.ceil(total / limit)

  return {
    users,
    total,
    totalPages,
  }
}

/**
 * Delete User
 */
export async function deleteUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const id = formData.get('id') as string

    const session = await auth()

    if (!session || !session.user || !session.user.role)
      throw new Error('Must be signed in first')

    if (session.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action')

    await prisma.user.delete({
      where: {
        id,
      },
    })

    revalidatePath('/admin/users')

    return {
      message: 'User deleted successfully',
      success: true,
    }
  } catch (error) {
    console.log(error)
    return {
      message: formatErrors(error as Error),
      success: false,
    }
  }
}

/**
 * Update User
 * @access Admin
 */
export async function updateUser(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    const session = await auth()

    if (!session || !session.user || !session.user.role)
      throw new Error('Must be signed in first')

    if (session.user.role !== 'admin')
      throw new Error('You are not authorized to perform this action')

    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    })

    if (!user) throw new Error('User not found')

    const userObject = UpdateUserSchema.parse({
      name: formData.get('name'),
      email: user.email,
      role: formData.get('role') || user.role,
    })

    await prisma.user.update({
      where: {
        id,
      },
      data: userObject,
    })

    revalidatePath(`/admin/users/${id}`)

    return {
      message: 'User updated successfully',
      success: true,
    }
  } catch (error) {
    console.log(error)
    if (isRedirectError(error)) throw error

    return {
      message: formatErrors(error as Error),
      success: false,
    }
  }
}
