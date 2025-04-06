'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminSearch() {
  const [queryValue, setQueryValue] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!queryValue.trim()) return router.replace(pathname)

    if (pathname === '/admin/orders') {
      router.replace(`/admin/orders?query=${queryValue}`)
    } else if (pathname === '/admin/products') {
      router.push(`/admin/products?query=${queryValue}`)
    } else if (pathname === '/admin/users') {
      router.replace(`/admin/users?query=${queryValue}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className='flex items-center space-x-2'>
      <Input
        type='text'
        value={queryValue}
        placeholder='Search...'
        onChange={(e) => setQueryValue(e.target.value)}
        className='md:w-[100px] lg:w-[300px]'
      />
      <Button className='sr-only' type='submit'>
        Search
      </Button>
      {queryValue.trim() ? (
        <Button
          onClick={() => {
            setQueryValue('')
            router.replace(pathname)
          }}
          variant='secondary'
          size='icon'
        >
          <X className='w-4 h-4' />
        </Button>
      ) : null}
    </form>
  )
}
