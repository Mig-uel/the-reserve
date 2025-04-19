'use client'

// TODO: remove non-client code from this file into reviews-list.tsx

import { Button } from '@/components/ui/button'
import type { Review } from '@/zod'
import Link from 'next/link'
import { useState } from 'react'

export default function Reviews({
  productSlug,
  userId,
}: {
  productSlug: string
  userId: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reviews, setReviews] = useState<Review[]>([])

  console.log(userId)

  return (
    <div className='space-y-4'>
      {!reviews.length ? <div>No reviews yet</div> : null}

      {userId.length ? (
        <></>
      ) : (
        <div>
          <Button asChild variant='link' className='px-1 text-md'>
            <Link href={`/sign-in?callbackUrl=/product/${productSlug}`}>
              Sign In
            </Link>
          </Button>
          to leave a review
        </div>
      )}

      <div className='flex flex-col gap-3'>{/* TODO: reviews here */}</div>
    </div>
  )
}
