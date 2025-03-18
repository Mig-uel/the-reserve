import SubmitButton from '@/components/submit-button'
import { createOrder } from '@/lib/actions/order.actions'
import { Check } from 'lucide-react'

export default function PlaceOrderForm() {
  return (
    <form action={createOrder} className='w-full'>
      <SubmitButton className='w-full mt-8'>
        <Check className='w-4 h-4' /> Place Order
      </SubmitButton>
    </form>
  )
}
