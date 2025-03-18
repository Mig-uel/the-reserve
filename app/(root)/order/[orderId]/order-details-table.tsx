import CartSubtotal from '@/components/shared/cart/cart-subtotal'
import CartTable from '@/components/shared/cart/cart-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getOrderById } from '@/lib/actions/order.actions'
import { formatDateTime, shortenUUID } from '@/lib/utils'
import { ShippingAddress } from '@/zod'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailsTable({ params }: Props) {
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
        </div>
      </div>
    </>
  )
}
