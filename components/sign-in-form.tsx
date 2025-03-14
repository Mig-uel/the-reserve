'use client'

import { signInWithCredentials } from '@/lib/actions/user.action'
import Link from 'next/link'
import { useActionState } from 'react'
import SubmitButton from './submit-button'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignInForm() {
  const [data, action, isPending] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
    email: '',
  })

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

        {/* Password Input*/}
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
          <SubmitButton>Sign In</SubmitButton>
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
