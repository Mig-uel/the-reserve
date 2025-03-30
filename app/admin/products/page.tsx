import Pagination from '@/components/pagination'
import FormContainer from '@/components/shared/form/form-container'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteProduct, getAllProducts } from '@/lib/actions/product.actions'
import { formatCurrency, shortenUUID } from '@/lib/utils'
import { Pen, Trash } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ category: string; page: number; query: string }>
}

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { category = '', page = 1, query: searchText = '' } = await searchParams

  const data = await getAllProducts({
    query: searchText,
    page: Number(page),
    category,
  })

  if (!data || !data.products || data.products.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <h1 className='h2-bold'>No Products Found</h1>
      </div>
    )
  }

  const { products, totalPages } = data

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <h1 className='h2-bold'>Products</h1>

        <Button asChild>
          <Link href='/admin/products/create'>Create Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className='text-right'>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{shortenUUID(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='secondary' size='icon'>
                  <Link href={`/admin/products/${product.id}`}>
                    <Pen />
                  </Link>
                </Button>

                {/* TODO: add a way to delete images when deleting product from database */}
                <FormContainer action={deleteProduct.bind(null, product.id)}>
                  <SubmitButton variant='destructive'>
                    <Trash className='w-4 h-4' />
                  </SubmitButton>
                </FormContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} />
      ) : null}
    </div>
  )
}
