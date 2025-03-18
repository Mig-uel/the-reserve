import CartTable from '@/components/shared/cart/cart-table'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart',
}

export default function CartPage() {
  return (
    <div>
      <h1 className='py-4 h2-bold'>Your Cart</h1>

      <div className='grid md:grid-cols-4 md:gap-5'>
        <CartTable />
      </div>
    </div>
  )
}
