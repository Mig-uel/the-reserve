import { ShoppingCart, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'

export default function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link className='flex-start' href='/'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} Logo`}
              height={48}
              width={48}
              priority
            />
            <span className='hidden font-bold text-2xl ml-3 lg:block'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='space-x-2'>
          <Button asChild variant='ghost'>
            <Link href='/cart'>
              <ShoppingCart /> Cart
            </Link>
          </Button>

          <Button asChild variant='default'>
            <Link href='/sign-in'>
              <UserIcon /> Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
