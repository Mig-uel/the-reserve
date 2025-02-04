'use client'

import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image
        src='/images/logo.svg'
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority
      />

      <div className='p-6 w-1/3 rounded-lg shadow-md text-center'>
        <h1 className='text-3xl font-bold mb-4'>404 Not Found</h1>

        <p className='text-destructive'>
          Seems this item walked off the runway. Explore more styles!
        </p>

        <Button asChild variant='outline' className='mt-4 ml-2'>
          <Link href='/'>Home</Link>
        </Button>
      </div>
    </div>
  )
}
