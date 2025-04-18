import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAllCategories } from '@/lib/actions/product.actions'
import { SearchIcon } from 'lucide-react'

// TODO: convert this component to use onsubmit method instead of action
export default async function Search() {
  const categories = await getAllCategories()

  return (
    <form action='/search' method='GET'>
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Select name='category'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='All' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem key='All' value='all'>
              All
            </SelectItem>

            {categories.map((category) => (
              <SelectItem key={category.category} value={category.category}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          name='q'
          type='text'
          placeholder='Search...'
          className='md:w-[100px] lg:w-[300px]'
        />

        <Button size='icon' type='submit' variant='ghost'>
          <SearchIcon />
        </Button>
      </div>
    </form>
  )
}
