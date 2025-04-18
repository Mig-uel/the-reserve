import ProductCard from '@/components/shared/product/product-card'
import { getAllProducts } from '@/lib/actions/product.actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
}

type Props = {
  searchParams: Promise<{
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: Props) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* TODO: Implement filter functionality */}
      </div>

      <div className='space-y-4 md:col-span-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.products.length > 0 ? (
            products.products.map((product) => (
              // @ts-expect-error fix type error
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div>No Products Found</div>
          )}
        </div>
      </div>
    </div>
  )
}
