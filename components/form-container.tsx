'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

export type actionFunction = (
  // eslint-disable-next-line
  prevState: any,
  formData: FormData,
  // eslint-disable-next-line
  ...args: any[]
) => Promise<{ message: string; success: boolean }>

const initialState = {
  message: '',
  success: false,
}

export default function FormContainer({
  action,
  children,
  className,
}: {
  action: actionFunction
  children: React.ReactNode
  className?: string
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success && state.message)
      toast(state.message, {
        action: {
          label: 'Go to Cart',
          onClick: () => router.push('/cart'),
        },
      })
    else if (!state.success && state.message)
      toast(state.message, {
        invert: true,
      })
  }, [router, state])

  return (
    <form action={formAction} className={cn(className)}>
      {children}
    </form>
  )
}
