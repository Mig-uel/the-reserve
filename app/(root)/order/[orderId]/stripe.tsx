'use client'
import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import { useState } from 'react'

const StripeForm = ({
  orderId,
  priceInCents,
}: {
  orderId: string
  priceInCents: number
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements || !email) return

    setIsLoading(true)

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
        },
      })
      .then(({ error }) => {
        if (
          error?.type === 'card_error' ||
          error?.type === 'validation_error'
        ) {
          setError(error?.message || 'An unexpected error occurred')
        } else if (error) {
          setError('An unexpected error occurred')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <form className='space-y-4 mt-4' onSubmit={handleSubmit}>
      {/* <div className='text-xl'>Stripe Checkout</div> */}

      {error ? <div className='text-destructive'>{error}</div> : null}

      <PaymentElement />

      <div>
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      </div>

      <Button
        className='w-full'
        size='lg'
        disabled={isLoading || stripe === null || elements === null}
      >
        {isLoading
          ? 'Purchasing...'
          : `Purchase ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  )
}

export default function StripePayment({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number
  orderId: string
  clientSecret: string
}) {
  const { theme, systemTheme } = useTheme()
  const currentTheme =
    theme === 'dark'
      ? 'night'
      : theme === 'light'
      ? 'stripe'
      : systemTheme === 'light'
      ? 'stripe'
      : 'night'

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  )
  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: currentTheme,
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm orderId={orderId} priceInCents={priceInCents} />
    </Elements>
  )
}
