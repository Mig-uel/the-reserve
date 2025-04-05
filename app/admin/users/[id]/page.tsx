import type { Metadata } from 'next'
import { Suspense } from 'react'
import UpdateUserForm from './update-user-form'
import { MiniSpinner } from '@/components/shared/spinner'

export const metadata: Metadata = {
  title: 'Admin User Update',
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function AdminUserUpdatePage({ params }: Props) {
  const { id } = await params

  return (
    <div className='space-y-8 max-w-lg mx-auto'>
      <h1 className='h2-bold'>Update User</h1>

      <Suspense fallback={<MiniSpinner />}>
        <UpdateUserForm id={id} />
      </Suspense>
    </div>
  )
}
