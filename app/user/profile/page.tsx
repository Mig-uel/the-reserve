import { MiniSpinner } from '@/components/shared/spinner'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import UpdateProfileForm from './update-profile-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function UserProfilePage() {
  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h2 className='h2-bold'>Your Profile</h2>

      <Suspense fallback={<MiniSpinner />}>
        <UpdateProfileForm />
      </Suspense>
    </div>
  )
}
