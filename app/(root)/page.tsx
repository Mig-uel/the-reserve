import ProductList from '@/components/shared/product/product-list'
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants'
import { getLatestProducts } from '@/lib/helpers'
import { convertToPlainObject } from '@/lib/utils'
import { Product } from '@/types'
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
      <ProductList
        data={latestProducts}
        title='Newest Arrivals'
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  )
}
