import ProductCard from '@/components/shared/product/product-card'
import { getAllCategories, getAllProducts } from '@/lib/actions/product.actions'
import type { Metadata } from 'next'
import Link from 'next/link'

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

const priceRanges = [
  {
    name: 'Under $50',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: 'Over $500',
    value: '501-1000',
  },
]

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

  const filterUrl = ({
    q,
    category,
    price,
    rating,
    sort,
  }: {
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
  }) => {
    const params = new URLSearchParams()

    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (price) params.set('price', price)
    if (rating) params.set('rating', rating)
    if (sort) params.set('sort', sort)

    return '/search?' + params.toString()
  }

  const categories = await getAllCategories()

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* Category Links */}
        <div className='text-xl mb-2 mt-3'>Department</div>
        <div>
          <ul className='space-y-1'>
            {/* Add category links here */}
            <li>
              <Link
                href={filterUrl({})}
                className={
                  category === 'all' || category === '' ? 'font-bold' : ''
                }
              >
                Any
              </Link>
            </li>

            {categories.map((c) => (
              <li key={c.category}>
                <Link
                  href={filterUrl({ category: c.category })}
                  className={category === c.category ? 'font-bold' : ''}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Links */}
        <div className='text-xl mb-2 mt-8'>Price Range</div>
        <div>
          <ul className='space-y-1'>
            {/* Add category links here */}
            <li>
              <Link
                href={filterUrl({})}
                className={price === 'all' ? 'font-bold' : ''}
              >
                Any
              </Link>
            </li>

            {priceRanges.map((p) => (
              <li key={p.name}>
                <Link
                  href={filterUrl({ price: p.value })}
                  className={price === p.value ? 'font-bold' : ''}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
