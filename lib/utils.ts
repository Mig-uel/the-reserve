// TODO: improve error handling

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NUMBER_FORMATTER } from './constants'
import { ZodError } from 'zod'

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

/**
 * Format Errors
 */
export async function formatErrors(
  error: Error & {
    code?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: any
  }
) {
  if (error instanceof ZodError) {
    // handle zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    )

    return fieldErrors.join('. ')
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // return typeof error.message === 'string'
    //   ? error.message
    //   : JSON.stringify(error.message)
    return 'Something went wrong. Please try again later'
  }
}

/**
 * Round Number to 2 Decimal Places
 */
export function roundNumber(value: number | string) {
  if (typeof value === 'number') {
    return Math.round(((value + Number.EPSILON) * 100) / 100)
  } else if (typeof value === 'string') {
    return Math.round(((Number(value) + Number.EPSILON) * 100) / 100)
  }

  throw new Error('Value is not a number or string')
}
