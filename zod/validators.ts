import { formatNumberWithDecimal } from '@/lib/utils'
import { z } from 'zod'

/**
 * Schema for Inserting Products
 */
const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(+val)),
    'Price must have exactly two decimal places'
  )
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
