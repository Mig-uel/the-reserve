import { z } from 'zod'
import {
  CartItemSchema,
  InsertCartSchema,
  InsertOrderItemSchema,
  InsertOrderSchema,
  PaymentMethodsSchema,
  PaymentResultSchema,
  ShippingAddressSchema,
  type InsertReviewSchema,
} from './validators'

export type Cart = z.infer<typeof InsertCartSchema>
export type CartItem = z.infer<typeof CartItemSchema>

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export type PaymentMethod = z.infer<typeof PaymentMethodsSchema>

export type Order = z.infer<typeof InsertOrderSchema> & {
  id: string
  createdAt: string
  isPaid: boolean
  paidAt: Date | null
  isDelivered: boolean
  deliveredAt: Date | null
  orderItems: OrderItem[]
  user: {
    name: string
    email: string
  }
}
export type OrderItem = z.infer<typeof InsertOrderItemSchema>

export type PaymentResult = z.infer<typeof PaymentResultSchema>

export type Review = z.infer<typeof InsertReviewSchema> & {
  id: string
  createdAt: Date
  user?: {
    name: string
  }
  numReviews: number
}
