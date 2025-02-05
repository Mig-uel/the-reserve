'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className='space-y-4'>
      {/* Active Product Image */}
      <Image
        src={images[current]}
        alt='product image'
        width={1000}
        height={1000}
        className='min-h-[300px] object-cover object-center'
      />

      {/* Product Image Thumbnails */}
      <div className='flex'>
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'border mr-2 cursor-pointer hover:border-orange-600',
              current === index && 'border-orange-500'
            )}
          >
            <Image
              src={image}
              alt={`product image ${index + 1}`}
              height={100}
              width={100}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
