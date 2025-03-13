import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from './product-price'

export default function ProductCard({ product }: { product: Product }) {
  const href = `/product/${product.slug}`

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-0 items-center'>
        <Link href={href}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority
          />
        </Link>
      </CardHeader>

      <CardContent className='p-4 grid gap-4'>
        <div className='text-xs'>{product.brand}</div>

        <Link href={href}>
          <h2 className='font-medium text-sm'>{product.name}</h2>
        </Link>

        <div className='flex-between gap-4'>
          <p>{+product.rating} stars</p>

          {product.stock ? (
            <ProductPrice value={+product.price} />
          ) : (
            <p className='text-destructive'>Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
