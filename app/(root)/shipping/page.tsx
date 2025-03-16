import { MiniSpinner } from '@/components/shared/spinner'
import { getUserCart } from '@/lib/actions/cart.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import ShippingForm from './shipping-form'

export const metadata: Metadata = {
  title: 'Shipping',
}

export default async function ShippingPage() {
  const cart = await getUserCart()

  if (!cart || cart.items.length === 0) return redirect('/cart')

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h1 className='h2-bold mt-4'>Shipping</h1>
      <p className='text-sm text-muted-foreground'>Please enter your address</p>

      <Suspense fallback={<MiniSpinner />}>
        <ShippingForm />
      </Suspense>
    </div>
  )
}
