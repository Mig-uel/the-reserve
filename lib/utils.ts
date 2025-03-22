// TODO: improve error
'server only'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CURRENCY_FORMATTER, NUMBER_FORMATTER } from './constants'
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

/**
 * Format Currency
 */
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
  } else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
  } else return NaN
}

/**
 * Format Number
 */
const NUMBER_FORMATTER_2 = new Intl.NumberFormat('en-US')
export function formatNumber(number: number) {
  return NUMBER_FORMATTER_2.format(number)
}

/**
 * Shorten UUID
 */
export function shortenUUID(uuid: string) {
  return `...${uuid.substring(uuid.length - 6)}`
}

/**
 * Format Date and Time
 */
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  )

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}
