import FormContainer from '@/components/shared/form/form-container'
import { getProductById, updateProduct } from '@/lib/actions/product.actions'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NameSlugInput from '../create/name-slug-input'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ImageUploadInput from '../create/image-upload-input'
import FeaturedInput from '../create/featured-input'
import { Textarea } from '@/components/ui/textarea'
import SubmitButton from '@/components/submit-button'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Update Product',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminProductUpdatePage({ params }: Props) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) return notFound()

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h1 className='h2-bold'>Update Product</h1>

      <div className='my-8'>
        <FormContainer
          action={updateProduct}
          className='space-y-8 grid md:grid-cols-2 gap-2'
        >
          {/* Name and Slug Input */}
          <NameSlugInput name={product.name} />

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
                defaultValue={product.category}
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
                defaultValue={product.brand}
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
                defaultValue={product.price}
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
                defaultValue={product.stock}
                min={0}
              />
            </div>
          </div>

          <div className='upload-field flex flex-col md:flex-row gap-5 col-span-2'>
            {/* Product Images */}
            <ImageUploadInput images={product.images} />
          </div>

          {/* Featured */}
          <FeaturedInput
            isFeatured={product.isFeatured}
            banner={product.banner || ''}
          />

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
                defaultValue={product.description || ''}
              />
            </div>
          </div>

          {/* Hidden Input for ID */}
          <input type='hidden' name='id' value={product.id} />

          {/* Submit Button */}
          <SubmitButton size='lg' className='col-span-2'>
            <Plus className='w-4 h-4' />
            Update Product
          </SubmitButton>
        </FormContainer>
      </div>
    </div>
  )
}
