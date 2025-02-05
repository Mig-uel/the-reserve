import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>
      </CardHeader>

      <CardContent className='p-4 grid gap-4'>
        <div className='text-xs'>{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-sm font-medium'>{product.name}</h2>
        </Link>

        <div className='flex-between gap-4'>
          <p>{product.rating} [STARS]</p>
          {product.stock ? (
            <p className='font-bold'>{product.price}</p>
          ) : (
            <p className='text-destructive'>Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
