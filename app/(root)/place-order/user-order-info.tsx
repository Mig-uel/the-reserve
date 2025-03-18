import { auth } from '@/auth'
import CartTable from '@/components/shared/cart/cart-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUserById } from '@/lib/actions/user.action'
import type { Cart, ShippingAddress } from '@/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UserOrderInfo({ cart }: { cart: Cart }) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return redirect('/')

  const userId = session.user.id
  const user = await getUserById(userId)

  if (!user) return redirect('/sign-in?callbackUrl=/shipping')
  if (!user.address) return redirect('/shipping')
  if (!user.paymentMethod) return redirect('/payment')

  const userAddress = user.address as ShippingAddress

  return (
    <>
      <Card>
        <CardContent className='p-4 gap-4'>
          <h2 className='text-xl pb-4'>Shipping Address</h2>
          <p>{userAddress.fullName}</p>
          <p>{userAddress.streetAddress}</p>
          <p>
            {userAddress.city} {userAddress.postalCode} {userAddress.country}
          </p>
          <div className='mt-3'>
            <Button asChild variant='outline'>
              <Link href='/shipping'>Edit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-4 gap-4'>
          <h2 className='text-xl pb-4'>Payment Method</h2>
          <p>
            {user.paymentMethod === 'CashOnDelivery'
              ? user.paymentMethod.replace(/([a-z])([A-Z])/g, '$1 $2')
              : user.paymentMethod}
          </p>

          <div className='mt-3'>
            <Button asChild variant='outline'>
              <Link href='/payment'>Edit</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-4 gap-4'>
          <h2 className='text-xl pb-4'>Order Items</h2>

          <CartTable finalScreen cart={cart} />
        </CardContent>
      </Card>
    </>
  )
}
