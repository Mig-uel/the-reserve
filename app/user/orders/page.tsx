import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrdersByUserId } from '@/lib/actions/order.actions'
import { formatCurrency, formatDateTime, shortenUUID } from '@/lib/utils'
import { Check, Ellipsis, X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ page: string }>
}

export const metadata: Metadata = {
  title: 'Orders',
}

export default async function UserOrdersPage({ searchParams }: Props) {
  const { page } = await searchParams

  const { data } = await getOrdersByUserId({
    page: Number(page) || 1,
  })

  if (!data.length)
    return (
      <div className='space-y-2'>
        <div className='h2-bold'>Your Orders</div>
      </div>
    )

  return (
    <div className='space-y-2'>
      <div className='h2-bold'>Your Orders</div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{shortenUUID(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    <X className='w-4 h-4' />
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <Check className='w-4 h-4' />
                  ) : (
                    <X className='w-4 h-4' />
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='icon'>
                    <Link href={`/order/${order.id}`}>
                      <Ellipsis className='w-4 h-4' />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
