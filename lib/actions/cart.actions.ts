'use server'

import type { CartItem } from '@/zod'

/**
 * Add CartItem to Cart
 */
export async function addItemToCart(item: CartItem) {
  return {
    message: 'Item added to cart',
    success: true,
  }
}
