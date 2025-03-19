'use server'

// TODO: simplify returns (return redirect instead of returning message on success)

import { auth, signIn, signOut } from '@/auth'
import { prisma } from '@/db/prisma'
import {
  PaymentMethodsSchema,
  ShippingAddressSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UpdateUserProfileSchema,
} from '@/zod/validators'
import { hashSync } from 'bcrypt-ts-edge'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatErrors } from '../utils'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

// TODO: modify to return error messages instead of console logging
/**
 * Update User's Address
 */
export async function updateUserAddress(formData: FormData) {
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

    console.log(error)
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
 * TODO: add toast messages
 */
export async function updateUserProfile(formData: FormData) {
  try {
    const userObject = UpdateUserProfileSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
    })

    const session = await auth()

    if (!session || !session.user) throw new Error('Must be signed in first')

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

    revalidatePath('/user/profile')
  } catch (error) {
    console.log(error)
  }
}
