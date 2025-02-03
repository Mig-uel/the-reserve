import Footer from '@/components/footer'
import Header from '@/components/shared/header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Reserve',
  description: 'Step Into the Reserve. Step Into Luxury.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex h-screen flex-col'>
      <Header />

      <main className='flex-1 wrapper'>{children}</main>

      <Footer />
    </div>
  )
}
