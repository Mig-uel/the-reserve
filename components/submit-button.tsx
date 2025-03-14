'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'

export default function SubmitButton({
  children,
}: {
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      className='w-full'
      type='submit'
      variant='default'
      disabled={pending}
    >
      {pending ? 'Submitting...' : children}
    </Button>
  )
}
