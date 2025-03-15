import Image from 'next/image'
import loader from '@/assets/loader.gif'

export function MiniSpinner() {
  return (
    <div>
      <Image src={loader} alt='Loading...' width={20} height={20} />
    </div>
  )
}
