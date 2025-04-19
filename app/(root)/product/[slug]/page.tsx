import ProductImages from '@/components/shared/product/product-images'
import ProductPrice from '@/components/shared/product/product-price'
import { MiniSpinner } from '@/components/shared/spinner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug } from '@/lib/actions/product.actions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import AddToCart from '../../../../components/shared/product/add-to-cart'
import ReviewsList from './reviews-list'
import Rating from '@/components/rating'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return {
    title: product ? product.name : '',
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) return notFound()

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          {/* Images Column */}
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>

          {/* Details Column */}
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>

              <div>
                <Rating value={+product.rating} />
                <p className='text-sm text-muted-foreground mt-2'>
                  {product.numReviews}{' '}
                  {product.numReviews > 1 ? 'Reviews' : 'Review'}
                </p>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <ProductPrice
                  value={+product.price}
                  className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                />
              </div>
            </div>

            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          {/* Actions Column */}
          <div>
            <Card>
              <CardContent className='px-4'>
                {/* Price */}
                <div className='mb-2 flex justify-between'>
                  <div>Price</div>
                  <div>
                    <ProductPrice value={+product.price} />
                  </div>
                </div>

                {/* Status */}
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out of Stock</Badge>
                  )}
                </div>

                {product.stock ? (
                  <div className='flex-center'>
                    <Suspense fallback={<MiniSpinner />}>
                      <AddToCart
                        item={{
                          image: product.images[0],
                          name: product.name,
                          price: product.price,
                          productId: product.id,
                          qty: 1,
                          slug: product.slug,
                        }}
                      />
                    </Suspense>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className='mt-10'>
        <h2 className='h2-bold mb-6'>Customer Reviews</h2>
        <Suspense fallback={<MiniSpinner />}>
          <ReviewsList productId={product.id} productSlug={product.slug} />
        </Suspense>
      </section>
    </>
  )
}
