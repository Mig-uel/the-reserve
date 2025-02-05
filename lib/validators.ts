import { z } from 'zod'
import { formatNumberWithDecimalPlaces } from './utils'

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimalPlaces(Number(val))),
    'Price must have exactly two decimal places'
  )

/** Schema for inserting products */
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(1, 'Category must be at least 1 character'),
  description: z.string().min(1, 'Description must be at least 3 character'),
  stock: z.coerce.number(),
  images: z.array(z.string().min(1, 'Product must have at least one image')),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
})
