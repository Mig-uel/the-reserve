import type { Products } from '@/lib/types'

type ProductListProps = {
  data: Products
  title?: string
  limit?: number
}

export default function ProductList({ data, title, limit }: ProductListProps) {
  const limitedData = limit ? data.slice(0, limit) : data

  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4'>{title}</h2>

      {data.length ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {limitedData.map((product) => (
            <div key={product.slug}>{product.name}</div>
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
