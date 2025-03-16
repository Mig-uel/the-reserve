import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ShippingAddress } from '@/zod'
import Link from 'next/link'

export default async function ShippingForm({
  address,
}: {
  address: ShippingAddress
}) {
  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h1 className='h2-bold mt-4'>Shipping</h1>
      <p className='text-sm text-muted-foreground'>Please enter your address</p>

      <form action='' className='space-y-4'>
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
              name='text'
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
      </form>
    </div>
  )
}
