import { cn } from '@/lib/utils'

type ProductPriceProps = {
  value: number
  className?: string
}

export default function ProductPrice({ className, value }: ProductPriceProps) {
  // ensure two decimal places
  const stringValue = value.toFixed(2)

  // split the dollar and cents
  const [dollar, cents] = stringValue.split('.')

  return (
    <p className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>$</span>
      {dollar}
      <span className='text-xs align-super'>.{cents}</span>
    </p>
  )
}
