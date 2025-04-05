import { auth } from '@/auth'
import FormContainer from '@/components/shared/form/form-container'
import SubmitButton from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserById, updateUser } from '@/lib/actions/user.action'
import { USER_ROLES } from '@/lib/constants'
import { notFound, redirect } from 'next/navigation'

export default async function UpdateUserForm({ id }: { id: string }) {
  const session = await auth()
  if (!session || !session.user) return redirect('/login')

  const user = await getUserById(id!)

  // check if the user editing is editing their own profile
  const isSameUser = session.user.id === id

  if (!user) return notFound()

  return (
    <FormContainer action={updateUser.bind(null, id)} className='space-y-4'>
      <div className='w-full'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          placeholder='Enter your email'
          defaultValue={user.email}
          disabled
        />
      </div>

      <div className='w-full'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          placeholder='Enter your name'
          defaultValue={user.name}
          required
          name='name'
        />
      </div>

      <div className='w-full'>
        <Label htmlFor='role'>Role</Label>
        <Select
          defaultValue={user.role}
          name='role'
          required
          disabled={isSameUser} // disable if the user is editing their own profile
        >
          <SelectTrigger>
            <SelectValue placeholder='Select role' />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                <span className='capitalize'>{role}</span>
              </SelectItem>
            ))}
          </SelectContent>
          {isSameUser && (
            <span className='text-xs text-red-500'>
              You cannot change your own role.
            </span>
          )}
        </Select>
      </div>

      <SubmitButton className='w-full'>Update User</SubmitButton>
    </FormContainer>
  )
}
