'use client'

import FormContainer from '@/components/shared/form/form-container'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createUpdateReview } from '@/lib/actions/review.actions'
import type { Review } from '@/zod'
import { StarIcon } from 'lucide-react'
import { useState } from 'react'

export default function ReviewForm({
  productId,
  userReview,
}: {
  productId: string
  userReview: Review | null
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    // TODO: close dialog on success
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        {userReview ? 'Update Review' : 'Leave a Review'}
      </Button>

      <DialogContent className='sm:max-w-[425px]'>
        <FormContainer action={createUpdateReview.bind(null, productId)}>
          <DialogHeader>
            <DialogTitle>
              {userReview ? 'Update Review' : 'Leave a Review'}
            </DialogTitle>
            <DialogDescription>
              Share your thoughts with other customers
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                name='title'
                type='text'
                id='title'
                placeholder='Enter a title'
                defaultValue={userReview?.title || ''}
                required
              />
            </div>

            <div>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                name='description'
                id='description'
                placeholder='Enter a description'
                defaultValue={userReview?.description || ''}
                required
              />
            </div>

            <div>
              <Label htmlFor='rating'>Rating</Label>
              <Select
                name='rating'
                required
                defaultValue={String(userReview?.rating) || ''}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a rating' />
                </SelectTrigger>

                <SelectContent id='rating'>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
                    <SelectItem key={rating} value={String(rating)}>
                      {rating} <StarIcon />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <SubmitButton size='lg' className='w-full'>
              {userReview ? 'Update Review' : 'Submit Review'}
            </SubmitButton>
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  )
}
