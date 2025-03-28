import { getAllProducts } from '@/lib/actions/product.actions'
import type { Metadata } from 'next'

type Props = {
  searchParams: Promise<{ category: string; page: number; query: string }>
}

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { category = '', page = 1, query: searchText = '' } = await searchParams

  const products = await getAllProducts({
    query: searchText,
    page: Number(page),
    category,
  })

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <h1 className='h2-bold'>Products</h1>
      </div>
    </div>
  )
}
