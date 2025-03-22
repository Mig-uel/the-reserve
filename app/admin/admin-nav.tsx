'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { title: 'Overview', href: '/admin/overview' },
  { title: 'Orders', href: '/admin/orders' },
  { title: 'Products', href: '/admin/products' },
  { title: 'Users', href: '/admin/users' },
]

export default function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className={cn(
            'text-sm font-medium  transition-colors hover:text-primary',
            pathname === link.href ? '' : 'text-muted-foreground'
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  )
}
