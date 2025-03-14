'use server'

// TODO: simplify returns (return redirect instead of returning message on success)

import { signIn, signOut } from '@/auth'
import { prisma } from '@/db/prisma'
import { SignInFormSchema, SignUpFormSchema } from '@/zod/validators'
import { hashSync } from 'bcrypt-ts-edge'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatErrors } from '../utils'

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
