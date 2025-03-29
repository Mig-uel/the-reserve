'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function NameSlugInput() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')

  return (
    <>
      <div className='flex flex-col md:flex-row gap-5'>
        {/* Product Name */}
        <div className='w-full'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            placeholder='Product Name'
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))
            }}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5'>
        {/* Product Slug */}
        <div className='w-full'>
          <Label htmlFor='slug'>Slug</Label>
          <Input
            id='slug'
            name='slug'
            type='text'
            placeholder='Product Slug'
            required
            readOnly
            value={slug}
          />
        </div>
      </div>
    </>
  )
}
