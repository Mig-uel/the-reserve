import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

// format number with decimal places
export function formatNumberWithDecimalPlaces(num: number): string {
  const [int, float] = num.toString().split('.')

  return float ? `${int}.${float.padEnd(2, '0')}` : `${int}.00`
}
