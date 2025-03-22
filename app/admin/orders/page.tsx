import Pagination from '@/components/pagination'
import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { requireAdmin } from '@/lib/auth-guard'
import { formatCurrency, formatDateTime, shortenUUID } from '@/lib/utils'
import { Check, Ellipsis, X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Orders',
}

type Props = {
  searchParams: Promise<{ page: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin()
  const { page = 1 } = await searchParams

  const orders = await getAllOrders({ page: Number(page), limit: 10 })

  return (
    <div className='space-y-2'>
      <div className='h2-bold'>All Orders</div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>USER</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{shortenUUID(order.id)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
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

                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 ? (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        ) : null}
      </div>
    </div>
  )
}
