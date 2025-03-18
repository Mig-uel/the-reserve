import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { Cart } from '@/zod'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CartSubtotal({
  cart,
  finalScreen,
}: {
  cart: Cart
  finalScreen?: boolean
}) {
  if (!finalScreen)
    return (
      <Card>
        <CardContent className='p-4 gap-4'>
          <div className='pb-3 text-xl'>
            Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):{' '}
            <span className='font-bold'>{formatCurrency(cart.itemsPrice)}</span>
          </div>

          <Button asChild className='w-full'>
            <Link href='/shipping'>
              <ArrowRight className='w-4 h-4' />
              Proceed to Checkout
            </Link>
          </Button>
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardContent className='p-4 gap-4 space-y-4'>
        <div className='flex justify-between'>
          <div>Items</div>
          <div>{formatCurrency(cart.itemsPrice)}</div>
        </div>

        <div className='flex justify-between'>
          <div>Tax</div>
          <div>{formatCurrency(cart.taxPrice)}</div>
        </div>

        <div className='flex justify-between'>
          <div>Shipping</div>
          <div>{formatCurrency(cart.shippingPrice)}</div>
        </div>

        <div className='flex justify-between'>
          <div>Total</div>
          <div>{formatCurrency(cart.totalPrice)}</div>
        </div>

        <Button asChild className='w-full'>
          <Link href='/shipping'>
            <ArrowRight className='w-4 h-4' />
            Proceed to Checkout
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
