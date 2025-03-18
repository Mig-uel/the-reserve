import CheckoutSteps from '@/components/shared/checkout-steps'
import { MiniSpinner } from '@/components/shared/spinner'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import PaymentForm from './payment-form'

export const metadata: Metadata = {
  title: 'Payment Method',
}

export default function PaymentPage() {
  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h2 className='h2-bold mt-4'>Payment Method</h2>
      <p className='text-sm text-muted-foreground'>
        Please select your payment method
      </p>

      <CheckoutSteps current={2} />

      <Suspense fallback={<MiniSpinner />}>
        <PaymentForm />
      </Suspense>
    </div>
  )
}
