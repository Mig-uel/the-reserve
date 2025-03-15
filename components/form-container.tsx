'use client'

import { cn } from '@/lib/utils'
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
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.message) toast(state.message)
  }, [state])

  return (
    <form action={formAction} className={cn(className)}>
      {children}
    </form>
  )
}
