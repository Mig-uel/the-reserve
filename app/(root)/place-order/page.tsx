import CartSubtotal from '@/components/shared/cart/cart-subtotal'
import CheckoutSteps from '@/components/shared/checkout-steps'
import { MiniSpinner } from '@/components/shared/spinner'
import { getUserCart } from '@/lib/actions/cart.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PlaceOrderForm from './place-order-form'
import UserOrderInfo from './user-order-info'

export const metadata: Metadata = {
  title: 'Place Order',
}

export default async function PlaceOrderPage() {
  const cart = await getUserCart()
  if (!cart || !cart.items.length) return redirect('/')

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>

      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Suspense fallback={<MiniSpinner />}>
            <UserOrderInfo cart={cart} />
          </Suspense>
        </div>

        <div>
          <CartSubtotal cart={cart} finalScreen />
          <PlaceOrderForm />
        </div>
      </div>
    </>
  )
}
