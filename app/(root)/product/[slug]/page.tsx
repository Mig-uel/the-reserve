import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug } from '@/lib/helpers'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          {/* Images Column */}
          <div className='col-span-2'>{/* Images Component */}</div>

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
                  value={Number(product.price)}
                  className='w-24 rounded-full bg-green-100 px-5 py-2 text-green-700'
                />
              </div>

              <div className='mt-10'>
                <p className='font-semibold'>Description</p>
                <p>{product.description}</p>
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {product.stock ? (
                    <Badge variant='outline'>In Stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out Of Stock</Badge>
                  )}
                </div>
                {!!product.stock && (
                  <div className='flex-center'>
                    <Button className='w-full'>Add To Cart</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
