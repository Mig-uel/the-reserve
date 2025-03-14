'use server'

import { signIn, signOut } from '@/auth'
import { SignInFormSchema } from '@/zod/validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

/**
 * Sign In User with Credentials
 */
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const authUser = await signIn('credentials', user)

    console.log(authUser)

    return {
      success: true,
      message: `Sign in successful`,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error

    return {
      success: false,
      message: 'Invalid email or password',
    }
  }
}

/**
 * Sign Out User
 */
export async function signOutUser() {
  await signOut()
}
