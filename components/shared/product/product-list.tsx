import type { Product } from '@/types'
import ProductCard from './product-card'

export default function ProductList({
  data,
  title,
  limit,
}: {
  data: Product[]
  title: string
  limit?: number
}) {
  const limitedData = limit ? data.slice(0, limit) : data

  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4'>{title}</h2>

      {data.length > 0 ? (
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {limitedData.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  )
}
