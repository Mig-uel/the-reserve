// TODO: separate payment form into client component for toast feedback

import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById, updateUserPaymentMethod } from '@/lib/actions/user.action'
import { PAYMENT_METHODS } from '@/lib/constants'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function PaymentForm() {
  const session = await auth()
  if (!session || !session.user || !session.user.id)
    return redirect('/signin?callbackUrl=/payment')

  const cart = await getUserCart()
  if (!cart || !cart.items.length) return redirect('/')

  const userId = session.user.id

  const user = await getUserById(userId)
  if (!user) return redirect('/')
  if (!user.address) return redirect('/shipping')

  return (
    <>
      <form action={updateUserPaymentMethod} className='space-y-4'>
        <div className='flex flex-col gap-5'>
          <RadioGroup
            name='paymentMethod'
            defaultValue={user?.paymentMethod || ''}
            className='flex flex-col space-y-2'
            required
          >
            {PAYMENT_METHODS.map((method) => {
              return (
                <div
                  key={method}
                  className='flex items-center space-x-3 space-y-0'
                >
                  <RadioGroupItem id={method} value={method} />
                  <Label htmlFor={method}>
                    {method === 'CashOnDelivery'
                      ? method.replace(/([a-z])([A-Z])/g, '$1 $2')
                      : method}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        <div className='flex gap-2'>
          <Button type='submit'>Save Payment Method</Button>

          <Button type='button' asChild variant='link'>
            <Link href='/shipping'>Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  )
}
