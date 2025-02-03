'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoonIcon, SunIcon, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ModeToggle() {
  // Because next-themes needs the window object which isn’t available during server-side rendering. The useEffect hook runs only after the component is loaded in the browser, so we used it to wait until the component is ready before doing anything.
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const themes = ['system', 'light', 'dark']

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          {theme === 'system' ? (
            <SunMoon />
          ) : theme === 'dark' ? (
            <MoonIcon />
          ) : (
            <SunIcon />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='capitalize'>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {themes.map((mode) => (
          <DropdownMenuCheckboxItem
            key={mode}
            checked={theme === mode}
            onClick={() => setTheme(mode)}
          >
            {mode}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
