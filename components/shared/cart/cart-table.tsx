import FormContainer from '@/components/form-container'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
} from '@/lib/actions/cart.actions'
import { formatCurrency } from '@/lib/utils'
import type { Cart } from '@/zod'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CartSubtotal from './cart-subtotal'

export default async function CartTable({
  cart,
  finalScreen,
}: {
  cart?: Cart
  finalScreen?: boolean
}) {
  cart = cart ? cart : await getUserCart()

  if (!cart?.items.length)
    return (
      <div>
        <div>Your cart is empty.</div>

        <Button variant='default' className='mt-4'>
          <Link href='/'>Go Shopping</Link>
        </Button>
      </div>
    )

  return (
    <>
      <div className='overflow-x-auto md:col-span-3'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className='text-center'>Quantity</TableHead>
              <TableHead className='text-right'>Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <Link
                    href={`/product/${item.slug}`}
                    className='flex items-center'
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <span className='px-2'>{item.name}</span>
                  </Link>
                </TableCell>

                <TableCell
                  className={!finalScreen ? 'flex-center gap-2' : 'text-center'}
                >
                  {
                    // If it's the final screen, don't show the remove button
                    !finalScreen ? (
                      <FormContainer
                        action={removeItemFromCart.bind(null, item.productId)}
                      >
                        <SubmitButton variant='outline'>
                          <Minus className='h-4 w-4' />
                        </SubmitButton>
                      </FormContainer>
                    ) : null
                  }

                  {!finalScreen ? (
                    <span>{item.qty}</span>
                  ) : (
                    <span className='px-2'>{item.qty}</span>
                  )}

                  {
                    // If it's the final screen, don't show the add button
                    !finalScreen ? (
                      <FormContainer action={addItemToCart.bind(null, item)}>
                        <SubmitButton variant='outline'>
                          <Plus className='h-4 w-4' />
                        </SubmitButton>
                      </FormContainer>
                    ) : null
                  }
                </TableCell>

                <TableCell className='text-right'>
                  {formatCurrency(+item.price * item.qty)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!finalScreen ? <CartSubtotal cart={cart} /> : null}
    </>
  )
}
