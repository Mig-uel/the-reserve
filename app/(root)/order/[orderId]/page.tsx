import { getOrderById } from '@/lib/actions/order.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = {
  title: 'Order Details',
}

export default async function OrderDetailsPage({ params }: Props) {
  const { orderId } = await params

  const order = await getOrderById(orderId)

  if (!order) return notFound()

  return <div>OrderDetailsPage</div>
}
