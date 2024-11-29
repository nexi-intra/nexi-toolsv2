'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu } from "lucide-react"
import { navLinks } from './navLinks'

const NavLinks = ({ className = '', onItemClick = () => { } }) => {
  const pathname = usePathname()

  return (
    <nav className={`${className} bg-white dark:bg-gray-800`}>
      <div className="text-gray-900 dark:text-white">Components</div>
      {navLinks.sort((a, b) => a.label.localeCompare(b.label)).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === link.href ? 'font-bold text-blue-600 dark:text-blue-400' : ''
            }`}
          onClick={onItemClick}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default function ComponentDocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => setIsOpen(false)

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 p-6 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <NavLinks className="space-y-1" />
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Menu className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <ScrollArea className="h-full py-6">
            <NavLinks className="space-y-1" onItemClick={closeSheet} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  )
}