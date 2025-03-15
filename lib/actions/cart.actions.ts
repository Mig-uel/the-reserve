'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import type { CartItem } from '@/zod'
import { CartItemSchema, InsertCartSchema } from '@/zod/validators'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import {
  convertToPlainObject,
  formatNumberWithDecimal,
  roundNumber,
} from '../utils'

/**
 * Calculate Cart Prices
 */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = formatNumberWithDecimal(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = roundNumber(+itemsPrice > 100 ? 0 : 10),
    taxPrice = roundNumber(0.15 * +itemsPrice),
    totalPrice = roundNumber(itemsPrice + taxPrice + shippingPrice)

  return {
    itemsPrice: (+itemsPrice).toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

/**
 * Add CartItem to Cart
 */
export async function addItemToCart(
  data: CartItem,
  // eslint-disable-next-line
  prevState: any,
  // eslint-disable-next-line
  formData: FormData
) {
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

    // if no cart exists
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
        message: `${product.name} added to cart`,
        success: true,
      }
    } else {
      // if cart exists

      // check if item is already in cart
      const existingItem = cart.items.find(
        (i) => i.productId === item.productId
      )

      if (existingItem) {
        // check stock
        if (product.stock < existingItem.qty + 1) {
          throw new Error('Not enough stock')
        }

        // increase qty
        existingItem.qty++
      } else {
        // if item does not exist in cart

        //check stock
        if (product.stock < 1) {
          throw new Error('Not enough stock')
        }

        // add item to the cart.items
        cart.items.push(item)
      }

      // save to database
      await prisma.cart.update({
        where: {
          id: cart.id,
        },

        data: {
          items: cart.items,
          ...calcPrice(cart.items as CartItem[]),
        },
      })

      revalidatePath(`/product/${product.slug}`)

      return {
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart`,
        success: true,
      }
    }
  } catch (error) {
    console.log(error)
    // if (error instanceof Error)
    //   return {
    //     message: formatErrors(error),
    //     success: false,
    //   }

    if (error instanceof Error)
      return {
        message: error.message,
        success: false,
      }

    return {
      message: 'An unexpected error occurred.',
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

/**
 * Remove Item From Cart
 */
export async function removeItemFromCart(
  productId: string,
  // eslint-disable-next-line
  prevState: any,
  // eslint-disable-next-line
  formData: FormData
) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value

    if (!sessionCartId) throw new Error('Cart session not found')

    // get product from database
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    })

    if (!product) throw new Error('Product not found')

    const cart = await getUserCart()

    if (!cart) throw new Error('Cart not found')

    // check user cart for product
    const existingItem = cart.items.find((i) => i.productId === productId)
    const isLastItem = existingItem?.qty === 1

    if (!existingItem) throw new Error('Item not in cart')

    // check qty of item
    if (existingItem.qty == 1) {
      // remove from cart
      cart.items = cart.items.filter(
        (i) => i.productId !== existingItem.productId
      )
    } else {
      // decrease qty
      existingItem.qty--
    }

    // update cart in database
    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    })

    revalidatePath(`/product/${product.slug}`)

    return {
      message: `${product.name} ${
        isLastItem ? 'was removed from cart' : 'was updated in cart'
      }`,
      success: true,
    }
  } catch (error) {
    console.log(error)
    if (error instanceof Error)
      return {
        // message: formatErrors(error),
        message: error.message,
        success: false,
      }

    return {
      message: 'An unexpected error occurred.',
      success: false,
    }
  }
}
