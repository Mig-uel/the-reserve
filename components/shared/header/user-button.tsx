import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutUser } from '@/lib/actions/user.action'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'

export default async function UserButton() {
  const session = await auth()

  if (!session)
    return (
      <Button asChild variant='default'>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    )

  const nameInitial = session.user.name?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200'
            >
              {nameInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-md leading-none'>
                Howdy, {session.user.name}!
              </div>

              <div className='text-muted-foreground font-md leading-none'>
                {session.user.email}!
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem className='p-0 mb-1'>
            <Button
              asChild
              className='w-full py-4 h-4 justify-start'
              variant='ghost'
            >
              <Link href='/user/orders'>Orders</Link>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem className='p-0 mb-1'>
            <Button
              asChild
              className='w-full py-4 h-4 justify-start'
              variant='ghost'
            >
              <Link href='/user/profile'>Profile</Link>
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem className='p-0 mb-1'>
            <form action={signOutUser} className='w-full'>
              <Button className='w-full py-4 h-4 justify-start' variant='ghost'>
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
