import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUserById, updateUserAddress } from '@/lib/actions/user.action'
import type { ShippingAddress } from '@/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import FormContainer from '../../../components/shared/form/form-container'

export default async function ShippingForm() {
  const session = await auth()

  if (!session || !session.user)
    return redirect('/sign-in?callbackUrl=/shipping')

  const userId = session.user.id as string

  const user = await getUserById(userId)

  const address = user.address as ShippingAddress

  return (
    <>
      <FormContainer action={updateUserAddress} className='space-y-4'>
        <div className='flex flex-col  gap-5'>
          <div className='w-full'>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              name='fullName'
              placeholder='John Doe'
              defaultValue={address?.fullName ?? ''}
            />
          </div>

          <div className='w-full'>
            <Label htmlFor='streetAddress'>Address</Label>
            <Input
              name='streetAddress'
              placeholder='123 Street Rd'
              defaultValue={address?.streetAddress || ''}
            />
          </div>

          <div className='w-full'>
            <Label htmlFor='city'>City</Label>
            <Input
              name='city'
              placeholder='City Plains'
              defaultValue={address?.city || ''}
            />
          </div>

          <div className='w-full'>
            <Label htmlFor='postalCode'>Postal Code</Label>
            <Input
              name='postalCode'
              placeholder='93021'
              defaultValue={address?.postalCode || ''}
            />
          </div>

          <div className='w-full'>
            <Label htmlFor='country'>Country</Label>
            <Input
              name='country'
              placeholder='United States'
              defaultValue={address?.country || ''}
            />
          </div>
        </div>

        <div className='flex gap-2'>
          <Button type='submit'>Save Address</Button>

          <Button type='button' asChild variant='link'>
            <Link href='/cart'>Cancel</Link>
          </Button>
        </div>
      </FormContainer>
    </>
  )
}
