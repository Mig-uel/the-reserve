'use server'

// TODO: simplify returns (return redirect instead of returning message on success)

import { signIn, signOut } from '@/auth'
import { SignInFormSchema } from '@/zod/validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

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
