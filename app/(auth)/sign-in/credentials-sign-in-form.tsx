'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function CredentialsSignInForm() {
  return (
    <form>
      <div className='space-y-6'>
        {/* Email input */}
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            defaultValue=''
          ></Input>
        </div>

        {/* Password input */}
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='password'
            defaultValue=''
          ></Input>
        </div>

        <div>
          <Button className='w-full'>Sign In</Button>
        </div>

        <div className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?
          <Button asChild variant='link'>
            <Link href='/sign-up' target='_self'>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
