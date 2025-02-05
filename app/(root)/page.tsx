import ProductList from '@/components/shared/product/product-list'
import sampleData from '@/db/sample-data'
import type { Product } from '@/lib/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  return (
    <>
      <ProductList
        data={sampleData.products as Product[]}
        title='Newest Arrivals'
        limit={4}
      />
    </>
  )
}
