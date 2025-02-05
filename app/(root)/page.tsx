import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/helpers'
import type { Product } from '@/lib/types'
import { convertToPlainObject } from '@/lib/utils'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  const latestProducts = convertToPlainObject<Product[]>(
    await getLatestProducts()
  )

  return (
    <>
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </>
  )
}
