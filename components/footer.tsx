import { APP_NAME } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className='border-t'>
      <div className='p-5 flex-center'>
        &copy; {year} {APP_NAME}. All Rights Reserved
      </div>
    </footer>
  )
}
