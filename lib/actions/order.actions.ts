// TODO: send toasts to the user when an error occurs
'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { InsertOrderSchema } from '@/zod/validators'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { notFound, redirect } from 'next/navigation'
import { convertToPlainObject } from '../utils'
import { getUserCart } from './cart.actions'
import { getUserById } from './user.action'

/**
 * Create Order Item and Order
 */
export async function createOrder() {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id)
      throw new Error('Must be signed in to place an order')

    const cart = await getUserCart()
    if (!cart || !cart.items.length) return redirect('/')

    const userId = session.user.id

    const user = await getUserById(userId)
    if (!user) return redirect('/')
    if (!user.address) return redirect('/shipping')
    if (!user.paymentMethod) return redirect('/payment')

    // create order object
    const order = InsertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    })

    // create a transaction to create order and order items in the database
    const insertedOrderId = await prisma.$transaction(async function (tx) {
      // create order
      const insertedOrder = await tx.order.create({ data: order })

      // create order items
      cart.items.forEach(async (item) => {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
          },
        })
      })

      // clear user cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          itemsPrice: 0,
        },
      })

      return insertedOrder.id
    })

    if (!insertedOrderId)
      throw new Error('Order was not placed, please try again')

    // TODO: disable place order button if order was placed successfully
    revalidatePath('/place-order')

    return redirect(`/order/${insertedOrderId}`)
  } catch (error) {
    if (isRedirectError(error)) throw error

    console.log(error)
  }
}

/**
 * Get Order by ID
 */
export async function getOrderById(id: string) {
  try {
    const data = await prisma.order.findFirst({
      where: { id },
      include: {
        orderitems: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return convertToPlainObject(data)
  } catch (error) {
    console.log(error)
    return notFound()
  }
}
