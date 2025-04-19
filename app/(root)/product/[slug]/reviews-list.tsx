import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { getAllReviews, getUserReview } from '@/lib/actions/review.actions'
import Link from 'next/link'
import ReviewForm from './review-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar, UserIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Rating from '@/components/rating'

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
          // @ts-expect-error fix type
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

      <div className='flex flex-col gap-3'>
        <p>Total Reviews: {reviews.length}</p>

        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className='flex-between'>
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className='flex space-x-4 text-sm text-muted-foreground'>
                <Rating value={review.rating} />

                <div className='flex items-center'>
                  <UserIcon className='mr-1 h-3 w-3' />
                  {review.user ? review.user.name : 'Deleted User'}
                </div>

                <div className='flex items-center'>
                  <Calendar className='mr-1 h-3 w-3' />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
