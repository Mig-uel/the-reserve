// TODO: send toasts to the user when an error occurs
'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { InsertOrderSchema } from '@/zod/validators'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { notFound, redirect } from 'next/navigation'
import { paypal } from '../paypal'
import { convertToPlainObject, formatErrors } from '../utils'
import { getUserCart } from './cart.actions'
import { getUserById } from './user.action'
import { PaymentResult } from '@/zod'
import { PAGE_SIZE } from '../constants'
import { Prisma } from '@prisma/client'

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
  // TODO: send notFound to the user if they try to access an order that is not theirs
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

/**
 * Create New Paypal Order
 */
export async function createPaypalOrder(orderId: string) {
  try {
    // get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) throw new Error('Order not found')

    // create paypal order object
    const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

    // update order in database with paypal order id
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          status: '',
          email: '',
          pricePaid: 0,
        },
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Order created successfully',
      data: paypalOrder.id,
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

/**
 * Approve Paypal Order and Update Order in Database
 * @param orderId
 * @param data
 */
export async function approvePaypalOrder(
  orderId: string,
  data: {
    orderId: string
  }
) {
  try {
    // get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderId)
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Payment not completed')

    // update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments.captures[0]?.amount?.value,
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Order paid successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

/**
 * Update Order to Paid
 * @param {orderId, paymentResult}
 */
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: PaymentResult
}) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },

    include: {
      orderitems: true,
    },
  })

  if (!order) throw new Error('Order not found')
  if (order.isPaid) throw new Error('Order already paid')

  // transaction to update order and update products in the database
  await prisma.$transaction(async (tx) => {
    // iterate over products and update stock
    order.orderitems.forEach(async (item) => {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      })
    })

    // update order to paid
    await tx.order.update({
      where: { id: orderId },

      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    })
  })

  // get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
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

  if (!updatedOrder) throw new Error('Order not found')
}

/**
 * Get Orders by User ID
 * @param {userId}
 * @returns {Promise<Order[]>}
 */
export async function getOrdersByUserId({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const session = await auth()

  if (!session || !session.user || !session.user.id)
    throw new Error('Must be signed in to view orders')

  const data = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderitems: true,
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const dataCount = await prisma.order.count({
    where: { userId: session.user.id },
  })

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  }
}

/**
 * Get Sales Data and Order Summary
 */
export async function getOrdersSummary() {
  // get counts for each resource
  const ordersCount = await prisma.order.count()
  const usersCount = await prisma.user.count()
  const productsCount = await prisma.product.count()

  // calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  })

  // get monthly sales data
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; total: Prisma.Decimal }>
  >`
    SELECT to_char("createdAt", 'MM/YY') as "month", SUM("totalPrice") as "total"
    FROM "Order"
    GROUP BY "month"
    `

  const salesData = salesDataRaw.map((entry) => {
    return { month: entry.month, totalSales: Number(entry.total) }
  })

  // get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    include: {
      user: {
        select: {
          name: true,
        },
      },
    },

    take: 6,
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  }
}

/**
 * Get All Orders
 * @access admin
 */
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const data = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    take: limit,

    skip: (page - 1) * limit,

    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })

  const dataCount = await prisma.order.count()

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  }
}

/**
 * Delete Order
 */
export async function deleteOrder(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  try {
    await prisma.order.delete({
      where: { id: formData.get('id') as string },
    })

    revalidatePath('/admin/orders')

    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
}

/**
 * Mark Cash On Delivery Order to Paid
 */
export async function markOrderAsPaid(
  orderId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  prevState: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
) {
  try {
    await updateOrderToPaid({
      orderId,
    })

    revalidatePath('/order/' + orderId)

    return {
      success: true,
      message: 'Order marked as paid successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
}

/**
 * Mark Order as Delivered
 */
export async function markOrderAsDelivered(
  orderId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  prevState: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    })

    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order not paid')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })

    revalidatePath('/order/' + orderId)

    return {
      success: true,
      message: 'Order marked as delivered successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error as Error),
    }
  }
}
