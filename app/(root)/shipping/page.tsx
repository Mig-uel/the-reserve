import { auth } from '@/auth'
import { getUserCart } from '@/lib/actions/cart.actions'
import { getUserById } from '@/lib/actions/user.action'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ShippingForm from './shipping-form'
import type { ShippingAddress } from '@/zod'

export const metadata: Metadata = {
  title: 'Shipping',
}

export default async function ShippingPage() {
  const cart = await getUserCart()

  if (!cart || cart.items.length === 0) return redirect('/cart')

  const session = await auth()

  if (!session || !session.user)
    return redirect('/sign-in?callbackUrl=/shipping')

  const userId = session.user.id as string

  const user = await getUserById(userId)

  return (
    <>
      <ShippingForm address={user.address as ShippingAddress} />
    </>
  )
}
