import { PAYMENT_METHODS } from '@/lib/constants'
import { formatNumberWithDecimal } from '@/lib/utils'
import { z } from 'zod'

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+val)),
    'Price must have exactly two decimal places'
  )

/**
 * Schema for Inserting Products
 */

export const InsertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),

  slug: z.string().min(3, 'Slug must be at least 3 characters'),

  category: z.string().min(3, 'Category must be at least 3 characters'),

  brand: z.string().min(1, 'Brand must be at least 1 characters'),

  description: z.string().min(3, 'Description must be at least 3 characters'),

  stock: z.coerce.number(),

  images: z.array(z.string()).min(1, 'Product must have at least one image'),

  isFeatured: z.boolean(),

  banner: z.string().nullable(),

  price: currency,
})

/**
 * Schema for Signing Users In
 */
export const SignInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

/**
 * Schema for Signing Users Up
 */
export const SignUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * Schema for CartItem
 */
export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
})

/**
 * Schema for Inserting Cart
 */
export const InsertCartSchema = z.object({
  items: z.array(CartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart ID is required'),
  userId: z.string().optional().nullable(),
})

/**
 * Schema for Shipping Address
 */
export const ShippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z
    .string()
    .min(3, 'Street address must be at least 3 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  postalCode: z
    .string()
    .min(5, 'Postal code must be at least 3 characters')
    .max(5, 'Postal code must be at most 5 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

/**
 * Schema for Payment Method
 */
export const PaymentMethodsSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  })

/**
 * Schema for Inserting Order
 */
export const InsertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,

  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: ShippingAddressSchema,
})

/**
 * Schema for Inserting OrderItem
 */
export const InsertOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().min(1, 'Image is required'),
  name: z.string().min(1, 'Name is required'),
  price: currency,
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
})

/**
 * Schema for Payment Result
 */
export const PaymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
})

/**
 * Schema for Updating User Profile
 */
export const UpdateUserProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .min(3, 'Email must be at least 3 characters'),
})

/**
 * Schema for Updating Products
 */
export const UpdateProductSchema = InsertProductSchema.extend({
  id: z.string().min(1, 'Product ID is required'),
})

/**
 * Schema for Updating Users
 */
export const UpdateUserSchema = UpdateUserProfileSchema.extend({
  id: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'user'], {
    errorMap: () => ({ message: 'Role must be either admin or user' }),
  }),
})
