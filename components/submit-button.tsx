'use client'

import { useFormStatus } from 'react-dom'
import { Button, buttonVariants } from './ui/button'
import { VariantProps } from 'class-variance-authority'
import { MiniSpinner } from './shared/spinner'

export default function SubmitButton({
  className = '',
  type = 'submit',
  variant = 'default',
  children,
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  type?: HTMLButtonElement['type']
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      className={className}
      type={type}
      variant={variant}
      disabled={pending}
      size={size}
    >
      {pending ? <MiniSpinner /> : children}
    </Button>
  )
}
