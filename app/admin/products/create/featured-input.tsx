'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export default function FeaturedInput({
  isFeatured,
  banner,
}: {
  isFeatured?: boolean
  banner?: string
}) {
  const [isFeaturedState, setIsFeaturedState] = useState(isFeatured || false)
  const [bannerImageState, setBannerImageState] = useState<string>(banner || '')

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
              checked={isFeaturedState}
              onCheckedChange={() => setIsFeaturedState((prev) => !prev)}
            />
            <Label htmlFor='isFeatured'>Featured</Label>
          </div>

          {isFeaturedState && bannerImageState ? (
            <>
              <Image
                src={bannerImageState}
                alt='Banner image'
                className='w-full object-cover object-center rounded-sm'
                width={1920}
                height={680}
              />
              <Input type='hidden' name='banner' value={bannerImageState} />
            </>
          ) : null}

          {/* TODO: make into reusable component */}
          {isFeaturedState && !bannerImageState ? (
            <UploadButton
              className='justify-self-start'
              endpoint='imageUploader'
              onUploadError={(error: Error) => {
                toast.error('Error: ' + error.message)
              }}
              onClientUploadComplete={(res: { url: string }[]) => {
                setBannerImageState(res[0].url)

                toast.success('Uploaded successfully!')
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
