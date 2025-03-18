import { MiniSpinner } from '@/components/shared/spinner'
import { Metadata } from 'next'
import { Suspense } from 'react'
import OrderDetailsTable from './order-details-table'

type Props = {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = {
  title: 'Order Details',
}

export default function OrderDetailsPage({ params }: Props) {
  return (
    <>
      <Suspense fallback={<MiniSpinner />}>
        <OrderDetailsTable params={params} />
      </Suspense>
    </>
  )
}
