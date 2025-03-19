import { auth } from '@/auth'
import SubmitButton from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUserProfile } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'

export default async function UpdateProfileForm() {
  const session = await auth()

  if (!session || !session.user) return redirect('/sign-in')

  return (
    <form className='space-y-4' action={updateUserProfile}>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          name='email'
          type='email'
          defaultValue={session.user.email as string}
          disabled
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          name='name'
          type='text'
          defaultValue={session.user.name as string}
          placeholder='Enter your name'
        />
      </div>

      <SubmitButton>Save Profile</SubmitButton>
    </form>
  )
}
