import FormContainer from '@/components/form-container'
import { Button } from '@/components/ui/button'
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart,
} from '@/lib/actions/cart.actions'
import type { CartItem } from '@/zod'
import { Minus, Plus } from 'lucide-react'

export default async function AddToCart({ item }: { item: CartItem }) {
  const cart = await getUserCart()

  // check if item is in cart
  const existingItem = cart?.items.find((i) => i.productId === item.productId)

  if (existingItem) {
    return (
      <>
        <FormContainer
          action={removeItemFromCart.bind(null, existingItem.productId)}
        >
          <Button type='submit' variant='outline'>
            <Minus className='h-4 w-4' />
          </Button>
        </FormContainer>

        <span className='px-2'>{existingItem.qty}</span>

        <FormContainer action={addItemToCart.bind(null, item)}>
          <Button type='submit' variant='outline'>
            <Plus className='h-4 w-4' />
          </Button>
        </FormContainer>
      </>
    )
  }

  return (
    <FormContainer action={addItemToCart.bind(null, item)} className='w-full'>
      <Button className='w-full' type='submit'>
        <Plus /> Add to Cart
      </Button>
    </FormContainer>
  )
}
