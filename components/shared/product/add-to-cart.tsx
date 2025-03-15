'use client'

import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.actions'
import type { CartItem } from '@/zod'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddToCart({ item }: { item: CartItem }) {
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
    toast.success(`${item.name} added to cart`, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    })

    return
  }

  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus /> Add to Cart
    </Button>
  )
}
