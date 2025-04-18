import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import ViewAllProductsButton from '@/components/view-all-products-button'
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions'

export default async function Homepage() {
  const latestProducts = await getLatestProducts()
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      {featuredProducts.length ? (
        // @ts-expect-error fix type later */}
        <ProductCarousel data={featuredProducts} />
      ) : null}

      {/* @ts-expect-error fix type later */}
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />

      <ViewAllProductsButton />
    </>
  )
}
