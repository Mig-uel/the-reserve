import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image
        src='/images/logo.svg'
        alt={`${APP_NAME} Logo`}
        height={48}
        width={48}
      />

      <div className='p-6 rounded-lg shadow-md text-center w-1/3'>
        <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
        <p className='text-destructive'>Could not find requested page...</p>

        <Button variant='outline' className='mt-4 ml-2' asChild>
          <Link href='/'>Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
