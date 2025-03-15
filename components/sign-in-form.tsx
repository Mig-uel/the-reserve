'use client'

// TODO: cleanup unused callbackUrl bind (we aren't using in the backend)

import { signInWithCredentials } from '@/lib/actions/user.action'
import Link from 'next/link'
import { useActionState } from 'react'
import SubmitButton from './submit-button'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useSearchParams } from 'next/navigation'

export default function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || ''

  const [data, action, isPending] = useActionState(
    signInWithCredentials.bind(null, callbackUrl),
    {
      message: '',
      success: false,
      email: '',
    }
  )

  return (
    <form action={action}>
      <div className='space-y-6'>
        {/* Email Input */}
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            disabled={isPending}
            defaultValue={data?.email as string}
          />
        </div>

        {/* Password Input */}
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            autoComplete='password'
            required
            disabled={isPending}
          />
        </div>

        {/* Submit Button */}
        <div>
          <SubmitButton className='w-full'>Sign In</SubmitButton>
        </div>

        {data && !data.success ? (
          <div className='text-center text-destructive'>{data.message}</div>
        ) : null}

        {/* Sign Up Link */}
        <div className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?
          <Button asChild variant='link' className='p-2'>
            <Link href='/sign-up' target='_self' className='link'>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
