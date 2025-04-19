import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { getAllReviews, getUserReview } from '@/lib/actions/review.actions'
import Link from 'next/link'
import ReviewForm from './review-form'

export default async function ReviewsList({
  productId,
  productSlug,
}: {
  productId: string
  productSlug: string
}) {
  const session = await auth()
  const userId = session?.user?.id || ''

  const reviews = await getAllReviews(productId)
  const userReview = await getUserReview(productId)

  return (
    <div className='space-y-4'>
      {!reviews.length ? <div>No reviews yet</div> : null}

      {userId.length ? (
        <ReviewForm
          productId={productId}
          // @t
          userReview={userReview}
        />
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
