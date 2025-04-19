import type { Order } from '@/zod'

export default function PurchaseReceiptEmail({ order }: { order: Order }) {
  return <div>Purchase Receipt for Order #{order.id}</div>
}
