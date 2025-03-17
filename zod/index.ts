import { z } from 'zod'
import {
  CartItemSchema,
  InsertCartSchema,
  PaymentMethodsSchema,
  ShippingAddressSchema,
} from './validators'

export type Cart = z.infer<typeof InsertCartSchema>
export type CartItem = z.infer<typeof CartItemSchema>

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export type PaymentMethod = z.infer<typeof PaymentMethodsSchema>
