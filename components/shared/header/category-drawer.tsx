import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { getAllCategories } from '@/lib/actions/product.actions'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'

export default async function CategoryDrawer() {
  const categories = await getAllCategories()

  if (!categories) return null

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline' size='icon'>
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent className='h-full max-w-sm px-6 py-10'>
        <DrawerTitle>Select a Category</DrawerTitle>

        <div className='space-y-1 mt-4'>
          {categories.map((c) => (
            <Button
              key={c.category}
              className='w-full justify-start'
              asChild
              variant='ghost'
            >
              <DrawerClose asChild>
                <Link href={`/search?category=${c.category}`}>
                  {c.category} ({c._count.category})
                </Link>
              </DrawerClose>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
