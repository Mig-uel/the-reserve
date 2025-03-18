import { z } from 'zod'
import {
  CartItemSchema,
  InsertCartSchema,
  InsertOrderItemSchema,
  InsertOrderSchema,
  PaymentMethodsSchema,
  ShippingAddressSchema,
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
