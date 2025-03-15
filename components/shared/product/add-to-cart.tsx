'use client'

// TODO: improve component to ssr

import { Button } from '@/components/ui/button'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import type { Cart, CartItem } from '@/zod'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart
  item: CartItem
}) {
  const router = useRouter()

  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if (res && !res.success) {
      toast.error(res.message, {
        invert: true,
      })
      return
    }

    // handle success adding to cart
    toast.success(res?.message, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    })

    return
  }

  // check if item is in cart
  const existingItem = cart?.items.find((i) => i.productId === item.productId)

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId)

    if (res && !res.success) {
      toast.error(res.message, {
        invert: true,
      })
      return
    }

    // handle success adding to cart
    toast.success(res?.message, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    })

    return
  }

  if (existingItem) {
    return (
      <div>
        <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
          <Minus className='h-4 w-4' />
        </Button>
        <span className='px-2'>{existingItem.qty}</span>
        <Button type='button' variant='outline' onClick={handleAddToCart}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>
    )
  }

  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus /> Add to Cart
    </Button>
  )
}
