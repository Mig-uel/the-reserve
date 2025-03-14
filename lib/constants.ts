export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'The Reserve'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_DESCRIPTION_NAME ||
  'A modern e-commerce store built with Next.js.'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4
export const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
