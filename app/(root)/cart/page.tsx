import CartTable from '@/components/shared/cart/cart-table'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart',
}

export default function CartPage() {
  return (
    <div>
      <CartTable />
    </div>
  )
}
