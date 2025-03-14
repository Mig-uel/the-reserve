'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function SignInForm() {
  return (
    <form>
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
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button className='w-full' type='submit' variant='default'>
            Sign In
          </Button>
        </div>

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
