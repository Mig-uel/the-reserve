'use client'

import { cn } from '@/lib/utils'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

const initialState = {
  message: '',
  success: false,
}

export type actionFunction = (
  // eslint-disable-next-line
  prevState: any,
  formData: FormData,
  // eslint-disable-next-line
  ...args: any[]
) => Promise<{ message: string; success: boolean }>

export default function FormContainer({
  action,
  children,
  className,
}: {
  action: actionFunction
  children: React.ReactNode
  className?: string
}) {
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
    } else if (!state.success && state.message) {
      toast(state.message, {
        invert: true,
      })
    }
  }, [state])

  return (
    <form action={formAction} className={cn(className)}>
      {children}
    </form>
  )
}
