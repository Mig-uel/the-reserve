'use client'

// TODO: add a way to remove images from the list
// TODO: add deletion of images from the server

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ImageUploadInput({ images }: { images: string[] }) {
  const [imagesState, setImagesState] = useState<string[]>(images || [])

  return (
    <div className='w-full'>
      <Label htmlFor='images'>Images</Label>
      <Card>
        <CardContent className='space-y-2 mt-2 min-h-48'>
          <div className='flex-start space-x-2'>
            {imagesState.length
              ? imagesState.map((image, index) => {
                  return (
                    <Image
                      key={image}
                      src={image}
                      alt={`Product image #${index + 1}`}
                      className='h-20 w-20 rounded-sm object-cover object-center'
                      width={100}
                      height={100}
                    />
                  )
                })
              : null}
          </div>

          <UploadButton
            className='justify-self-start'
            endpoint='imageUploader'
            onUploadError={(error: Error) => {
              toast.error('Error: ' + error.message)
            }}
            onClientUploadComplete={(res: { url: string }[]) => {
              setImagesState((prev) => [...prev, res[0].url])

              toast.success('Uploaded successfully!')
            }}
          />

          <Input
            type='hidden'
            name='images'
            value={JSON.stringify(imagesState)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
