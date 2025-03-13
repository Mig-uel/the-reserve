import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NUMBER_FORMATTER } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert Prisma object to a regular JS object
 */
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

/**
 * Format Number with Decimal
 */
export function formatNumberWithDecimal(value: number) {
  return NUMBER_FORMATTER.format(value)
}
