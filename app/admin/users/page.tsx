import Pagination from '@/components/pagination'
import DeleteDialog from '@/components/shared/delete-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllUsers } from '@/lib/actions/user.action'
import { shortenUUID } from '@/lib/utils'
import { Pen } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Users',
}

type Props = {
  searchParams: Promise<{ page?: string }>
}

export default async function UsersPage({ searchParams }: Props) {
  const { page = '1' } = await searchParams
  const { totalPages, users } = await getAllUsers({ page: Number(page) })

  if (!users) {
    return <div>No users found</div>
  }

  return (
    <div className='space-y-2'>
      <div className='h2-bold'>All Orders</div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{shortenUUID(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <Badge>Admin</Badge>
                  ) : (
                    <Badge variant='secondary'>User</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button asChild variant='outline' size='icon'>
                    <Link href={`/user/${user.id}`}>
                      <Pen className='w-4 h-4' />
                    </Link>
                  </Button>

                  {/* <DeleteDialog
                    id={user.id}
                    action={async () => {
                      'use server'
                      console.log('Delete user action')
                    }}
                  /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 ? (
          <Pagination page={Number(page) || 1} totalPages={totalPages} />
        ) : null}
      </div>
    </div>
  )
}
