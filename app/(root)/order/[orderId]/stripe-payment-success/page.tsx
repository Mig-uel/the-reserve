import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/order.actions'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

type Props = {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ payment_intent: string }>
}

export default async function StripeSuccessPage({
  params,
  searchParams,
}: Props) {
  const { orderId } = await params
  const { payment_intent: payment_intent_id } = await searchParams

  // fetch order
  const order = await getOrderById(orderId)
  if (!order) return notFound()

  // retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

  // check if payment intent is valid
  if (
    paymentIntent.metadata.orderId === null ||
    paymentIntent.metadata.orderId !== order.id
  ) {
    return notFound()
  }

  // check if payment was successful
  const isPaymentSuccessful = paymentIntent.status === 'succeeded'

  if (!isPaymentSuccessful) {
    return redirect(`/user/orders`)
  }

  // TODO: fix orderId
  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='h1-bold'>Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/user/orders`}>View Order</Link>
        </Button>
      </div>
    </div>
  )
}
