// TODO: prevent unauthorized user access to this page; if user does not own this order, redirect to 404 page

import { auth } from '@/auth'
import CartSubtotal from '@/components/shared/cart/cart-subtotal'
import CartTable from '@/components/shared/cart/cart-table'
import FormContainer from '@/components/shared/form/form-container'
import SubmitButton from '@/components/submit-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  getOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
} from '@/lib/actions/order.actions'
import { formatDateTime, shortenUUID } from '@/lib/utils'
import { ShippingAddress } from '@/zod'
import { notFound } from 'next/navigation'
import Stripe from 'stripe'
import PayPal from './paypal'
import StripePayment from './stripe'

type Props = {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailsTable({ params }: Props) {
  const session = await auth()

  const isAdmin = session?.user?.role === 'admin'

  const { orderId } = await params

  const order = await getOrderById(orderId)
  if (!order) return notFound()

  const {
    deliveredAt,
    id,
    isDelivered,
    isPaid,
    itemsPrice,
    paidAt,
    paymentMethod,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = order

  const shippingAddress = order.shippingAddress as ShippingAddress

  // stripe config
  let client_secret = ''
  if (paymentMethod === 'Stripe' && !isPaid) {
    // init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(totalPrice) * 100), // convert to cents
      currency: 'usd',
      metadata: {
        orderId: id,
      },
    })

    client_secret = paymentIntent.client_secret || ''
  }

  return (
    <>
      <h1 className='py-4 text-2xl'>Order #{shortenUUID(id)}</h1>

      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>

              {isPaid ? (
                <Badge variant='destructive'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.streetAddress}</p>
              <p className='mb-2'>
                {shippingAddress.city}, {shippingAddress.postalCode}{' '}
                {shippingAddress.country}
              </p>

              {isDelivered ? (
                <Badge variant='destructive'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>

              <CartTable
                finalScreen
                cart={{
                  items: order.orderitems,
                  itemsPrice,
                  shippingPrice,
                  taxPrice,
                  totalPrice,
                  sessionCartId: '',
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <CartSubtotal
            finalScreen
            cart={{
              items: order.orderitems,
              itemsPrice,
              shippingPrice,
              taxPrice,
              totalPrice,
              sessionCartId: '',
            }}
          />

          {/* PayPal Payment */}
          {!isPaid && paymentMethod === 'PayPal' ? (
            <PayPal
              order={{
                id,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                deliveredAt,
                isDelivered,
                isPaid,
                paidAt,
                paymentMethod,
                shippingAddress,
                user: order.user,
                userId: order.userId,
              }}
              paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            />
          ) : null}

          {/* Stripe Payment */}
          {!isPaid && paymentMethod === 'Stripe' ? (
            <StripePayment
              priceInCents={Math.round(Number(totalPrice) * 100)} // convert to cents
              orderId={id}
              clientSecret={client_secret}
            />
          ) : null}

          {/* Admin Actions */}
          {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' ? (
            <div className='mt-4 w-full'>
              <FormContainer
                action={markOrderAsPaid.bind(null, id)}
                className='w-full'
              >
                <SubmitButton className='w-full'>
                  Mark Order as Paid
                </SubmitButton>
              </FormContainer>
            </div>
          ) : null}

          {/* Admin Actions */}
          {isAdmin && isPaid && !isDelivered ? (
            <div className='mt-4 w-full'>
              <FormContainer
                action={markOrderAsDelivered.bind(null, id)}
                className='w-full'
              >
                <SubmitButton className='w-full'>
                  Mark Order as Delivered
                </SubmitButton>
              </FormContainer>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
