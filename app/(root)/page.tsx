import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'

export default async function Homepage() {
  const latestProducts = await getLatestProducts()

  return (
    <>
      {/* @ts-expect-error fix type later */}
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </>
  )
}
