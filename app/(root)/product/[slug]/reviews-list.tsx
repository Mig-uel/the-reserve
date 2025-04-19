import { auth } from '@/auth'
import Reviews from './reviews'

export default async function ReviewsList({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productId,
  productSlug,
}: {
  productId: string
  productSlug: string
}) {
  const session = await auth()
  const userId = session?.user?.id || ''

  return <Reviews userId={userId} productSlug={productSlug} />
}
