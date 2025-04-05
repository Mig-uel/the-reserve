import { getUserById } from '@/lib/actions/user.action'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  const user = await getUserById(id)

  if (!user) return notFound()

  return (
    <div className='space-y-8 max-w-lg'>
      <h1 className='h2-bold'>Update User</h1>

      {/* TODO: add update user form */}
    </div>
  )
}
