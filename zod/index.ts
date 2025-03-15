import { z } from 'zod'
import { CartItemSchema, InsertCartSchema } from './validators'

export type Cart = z.infer<typeof InsertCartSchema>
export type CartItem = z.infer<typeof CartItemSchema>
