import { auth } from '@/auth'
import SignInForm from '@/components/sign-in-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ callbackUrl: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const session = await auth()
  const { callbackUrl } = await searchParams

  if (session) return redirect(callbackUrl || '/')

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} Logo`}
              width={100}
              height={100}
              priority
            />
          </Link>

          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}
