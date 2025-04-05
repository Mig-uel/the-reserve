'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FeaturedInput() {
  const [isFeatured, setIsFeatured] = useState(false)
  const [bannerImage, setBannerImage] = useState<string>('')

  return (
    <div className='upload-field'>
      {/* Product Featured */}
      <Label htmlFor='isFeatured'>Featured Product</Label>
      <p className='text-sm text-muted-foreground'>
        Check this box if you want to feature this product on the home page.
      </p>
      <Card>
        <CardContent className='space-y-2 mt-2'>
          <div className='space-x-2 flex flex-row items-center'>
            <Checkbox
              id='isFeatured'
              name='isFeatured'
              checked={isFeatured}
              onCheckedChange={() => setIsFeatured((prev) => !prev)}
            />
            <Label htmlFor='isFeatured'>Featured</Label>
          </div>

          {isFeatured && bannerImage ? (
            <>
              <Image
                src={bannerImage}
                alt='Banner image'
                className='w-full object-cover object-center rounded-sm'
                width={1920}
                height={680}
              />
              <Input type='hidden' name='banner' value={bannerImage} />
            </>
          ) : null}

          {/* TODO: make into reusable component */}
          {isFeatured && !bannerImage ? (
            <UploadButton
              className='justify-self-start'
              endpoint='imageUploader'
              onUploadError={(error: Error) => {
                toast.error('Error: ' + error.message)
              }}
              onClientUploadComplete={(res: { url: string }[]) => {
                setBannerImage(res[0].url)

                toast.success('Uploaded successfully!')
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
