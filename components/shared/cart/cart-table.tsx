import FormContainer from '@/components/form-container'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { ArrowRight, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function CartTable() {
  const cart = await getUserCart()

  if (!cart?.items.length)
    return (
      <>
        <h1 className='py-4 h2-bold'>Your Cart</h1>
        <div>Your cart is empty.</div>

        <Button variant='default' className='mt-4'>
          <Link href='/'>Go Shopping</Link>
        </Button>
      </>
    )

  return (
    <>
      <h1 className='py-4 h2-bold'>Your Cart</h1>

      <div className='grid md:grid-cols-4 md:gap-5'>
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

                  <TableCell className='flex-center gap-2'>
                    <FormContainer
                      action={removeItemFromCart.bind(null, item.productId)}
                    >
                      <SubmitButton variant='outline'>
                        <Minus className='h-4 w-4' />
                      </SubmitButton>
                    </FormContainer>
                    <span>{item.qty}</span>
                    <FormContainer action={addItemToCart.bind(null, item)}>
                      <SubmitButton variant='outline'>
                        <Plus className='h-4 w-4' />
                      </SubmitButton>
                    </FormContainer>
                  </TableCell>

                  <TableCell className='text-right'>
                    {formatCurrency(+item.price * item.qty)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card>
          <CardContent className='p-4 gap-4'>
            <div className='pb-3 text-xl'>
              Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):{' '}
              <span className='font-bold'>
                {formatCurrency(cart.itemsPrice)}
              </span>
            </div>

            <Button asChild className='w-full'>
              <Link href='/shipping'>
                <ArrowRight className='w-4 h-4' />
                Proceed to Checkout
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
