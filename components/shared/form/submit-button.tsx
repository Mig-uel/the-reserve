'use client'

import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

export default function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()

  return (
    <div>
      <Button className='w-full' disabled={pending}>
        {pending ? 'Signing in...' : text}
      </Button>
    </div>
  )
}
