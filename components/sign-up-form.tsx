'use client'

// TODO: cleanup unused callbackUrl bind (we aren't using in the backend)

import { signUpUser } from '@/lib/actions/user.action'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import SubmitButton from './submit-button'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignUpForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || ''

  const [data, action, isPending] = useActionState(
    signUpUser.bind(null, callbackUrl),
    {
      message: '',
      success: false,
    }
  )

  return (
    <form action={action}>
      <div className='space-y-6'>
        {/* Name Input */}
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            required
            autoComplete='name'
            disabled={isPending}
          />
        </div>

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

        {/* Confirm Password Input */}
        <div>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            autoComplete='confirmPassword'
            required
            disabled={isPending}
          />
        </div>

        {/* Submit Button */}
        <div>
          <SubmitButton>Sign Up</SubmitButton>
        </div>

        {data && !data.success && data.message ? (
          <div className='text-center text-destructive'>{data.message}</div>
        ) : null}

        {/* Sign In Link */}
        <div className='text-sm text-center text-muted-foreground'>
          Already have an account?
          <Button asChild variant='link' className='p-2'>
            <Link href='/sign-in' target='_self' className='link'>
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
