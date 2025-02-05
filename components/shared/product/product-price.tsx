import { cn } from '@/lib/utils'

export default function ProductPrice({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  // ensure two decimal places
  const stringValue = value.toFixed(2)

  // get the int/float
  const [int, float] = stringValue.split('.')

  return (
    <p className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>$</span>
      {int}
      <span className='text-xs align-super'>.{float}</span>
    </p>
  )
}
