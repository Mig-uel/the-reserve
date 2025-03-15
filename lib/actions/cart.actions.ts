'use server'

import { auth } from '@/auth'
import type { CartItem } from '@/zod'
import { cookies } from 'next/headers'
import { convertToPlainObject, formatErrors, roundNumber } from '../utils'
import { prisma } from '@/db/prisma'
import { CartItemSchema, InsertCartSchema } from '@/zod/validators'
import { revalidatePath } from 'next/cache'

/**
 * Calculate Cart Prices
 */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundNumber(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = roundNumber(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundNumber(0.15 * itemsPrice),
    totalPrice = roundNumber(itemsPrice + taxPrice + shippingPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

/**
 * Add CartItem to Cart
 */
export async function addItemToCart(data: CartItem) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value

    if (!sessionCartId) throw new Error('Cart session not found!')

    // get session and user ID
    const session = await auth()
    const userId = session?.user.id as string

    // get cart
    const cart = await getUserCart()

    // parse and validate item
    const item = CartItemSchema.parse(data)

    // find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    })

    if (!product) throw new Error('Product not found')

    if (!cart) {
      const newCart = InsertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      })

      // add to database
      await prisma.cart.create({
        data: newCart,
      })

      // revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        message: 'Item added to cart',
        success: true,
      }
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error)
      return {
        message: formatErrors(error),
        success: false,
      }
  }
}

/**
 * Get User Cart
 */
export async function getUserCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value

  if (!sessionCartId) throw new Error('Cart session not found')

  // get session and user ID
  const session = await auth()
  const userId = session?.user.id as string

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  })

  if (!cart) return undefined

  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
