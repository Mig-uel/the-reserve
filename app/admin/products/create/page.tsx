import FormContainer from '@/components/shared/form/form-container'
import SubmitButton from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createProduct } from '@/lib/actions/product.actions'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import ImageUploadInput from './image-upload-input'
import NameSlugInput from './name-slug-input'
import FeaturedInput from './featured-input'

export const metadata: Metadata = {
  title: 'Create Product',
}

export default function AdminCreateProductPage() {
  return (
    <>
      <h2 className='h2-bold'>Create Product</h2>

      <div className='my-8'>
        <FormContainer
          action={createProduct}
          className='space-y-8 grid md:grid-cols-2 gap-2'
        >
          {/* Name and Slug Input */}
          <NameSlugInput />

          <div className='flex flex-col md:flex-row gap-5'>
            {/* Product Category */}
            <div className='w-full'>
              <Label htmlFor='category'>Category</Label>
              <Input
                id='category'
                name='category'
                type='text'
                placeholder='Product Category'
                required
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-5'>
            {/* Product Brand */}
            <div className='w-full'>
              <Label htmlFor='brand'>Brand</Label>
              <Input
                id='brand'
                name='brand'
                type='text'
                placeholder='Product Brand'
                required
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-5'>
            {/* Product Price */}
            <div className='w-full'>
              <Label htmlFor='price'>Price</Label>
              <Input
                id='price'
                name='price'
                type='number'
                placeholder='Product Price'
                required
                step={0.01}
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-5'>
            {/* Product Stock */}
            <div className='w-full'>
              <Label htmlFor='stock'>Stock</Label>
              <Input
                id='stock'
                name='stock'
                type='number'
                placeholder='Product Stock'
                required
              />
            </div>
          </div>

          <div className='upload-field flex flex-col md:flex-row gap-5 col-span-2'>
            {/* Product Images */}
            <ImageUploadInput images={[]} />
          </div>

          {/* Featured */}
          <FeaturedInput />

          <div className='flex flex-col md:flex-row gap-5 col-span-2'>
            {/* Product Description */}
            <div className='w-full'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Product Description'
                required
                className='resize-none'
              />
            </div>
          </div>

          <SubmitButton size='lg' className='col-span-2'>
            <Plus className='w-4 h-4' />
            Create Product
          </SubmitButton>
        </FormContainer>
      </div>
    </>
  )
}
