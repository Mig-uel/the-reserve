import ProductList from '@/components/shared/product/product-list'
import sampleData from '@/db/sample-data'

export default function Homepage() {
  return (
    <>
      <ProductList data={sampleData.products} title='Newest Arrivals' />
    </>
  )
}
