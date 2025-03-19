'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'

type Props = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

export default function Pagination({ totalPages, page, urlParamName }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePagination = (buttonType: 'prev' | 'next') => {
    const pageValue =
      buttonType === 'prev' ? Number(page) - 1 : Number(page) + 1

    const params = new URLSearchParams(searchParams)
    params.set(urlParamName || 'page', pageValue.toString())

    router.replace(`?${params.toString()}`)
  }

  return (
    <div className='flex gap-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={handlePagination.bind(null, 'prev')}
      >
        Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) >= totalPages}
        onClick={handlePagination.bind(null, 'next')}
      >
        Next
      </Button>
    </div>
  )
}
