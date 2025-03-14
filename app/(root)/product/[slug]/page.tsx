import ProductImages from '@/components/shared/product/product-images'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug } from '@/lib/actions/product.actions'
import { PlusIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
              <p>
                {product.rating} of {product.numReviews} Reviews
              </p>
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
                  <div className='flex'>
                    <Button className='w-full'>
                      <PlusIcon /> Add to Cart
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
