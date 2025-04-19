import { auth } from '@/auth'
import Reviews from './reviews'

export default async function ReviewsList({
  productId,
  productSlug,
}: {
  productId: string
  productSlug: string
}) {
  const session = await auth()
  const userId = session?.user?.id || ''

  return (
    <Reviews userId={userId} productSlug={productSlug} productId={productId} />
  )
}
