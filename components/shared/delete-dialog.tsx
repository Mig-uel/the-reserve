'use client'

import { Trash } from 'lucide-react'
import { useState } from 'react'
import SubmitButton from '../submit-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import FormContainer, { type actionFunction } from './form/form-container'

export default function DeleteDialog({
  id,
  action,
}: {
  id: string
  action: actionFunction
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size='icon' variant='destructive' className='ml-1'>
          <Trash className='w-4 h-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can&apos;t be undone
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <FormContainer action={action}>
            <input type='hidden' value={id} name='id' />
            <SubmitButton variant='destructive'>Delete</SubmitButton>
          </FormContainer>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
