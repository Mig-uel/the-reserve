import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
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

const ratings = [4, 3, 2, 1]

export default async function SearchPage({ searchParams }: Props) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams

  const filterUrl = ({
    c, // category
    s, // sort
    p, // price
    r, // rating
    pg, // page
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = new URLSearchParams({
      q,
      category,
      price,
      rating,
      sort,
      page,
    })

    if (c) params.set('category', c)
    if (s) params.set('sort', s)
    if (p) params.set('price', p)
    if (r) params.set('rating', r)
    if (pg) params.set('page', pg)

    return '/search?' + params.toString()
  }

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  const categories = await getAllCategories()

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* Category Links */}
        <div className='text-xl mb-2 mt-3'>Department</div>
        <div>
          <ul className='space-y-1'>
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
                  href={filterUrl({ c: c.category })}
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
                  href={filterUrl({ p: p.value })}
                  className={price === p.value ? 'font-bold' : ''}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Links */}
        <div className='text-xl mb-2 mt-8'>Customer Ratings</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={filterUrl({})}
                className={rating === 'all' ? 'font-bold' : ''}
              >
                Any
              </Link>
            </li>

            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={filterUrl({ r: r.toString() })}
                  className={rating === r.toString() ? 'font-bold' : ''}
                >
                  {r} stars & up
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='space-y-4 md:col-span-4'>
        <div className='flex-between flex-col my-4 md:flex-row'>
          <div className='flex items-center'>
            {q !== 'all' && q !== '' ? 'Query: ' + q : ''}
            {category !== 'all' && category !== ''
              ? 'Category: ' + category
              : ''}
            {price !== 'all' ? ' Price: ' + price : ''}
            {rating !== 'all' ? ' Rating: ' + rating + ' stars & up' : ''}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            price !== 'all' ||
            rating !== 'all' ? (
              <Button variant='link' asChild>
                <Link href='/search'>Clear</Link>
              </Button>
            ) : null}
          </div>

          <div>{/* TODO: sort component */}</div>
        </div>

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
