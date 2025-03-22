import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()

  if (!session) return redirect('/sign-in')
  if (!session.user || !session.user.role) return redirect('/sign-in')

  if (session.user.role !== 'admin') return redirect('/unauthorized')

  return session
}
