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
    <nav className={className}>
      <div>Components</div>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block py-2 px-4 text-sm hover:bg-gray-100 ${pathname === link.href ? 'font-bold' : ''
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
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 p-6 bg-gray-50">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <NavLinks className="space-y-1" />
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full py-6">
            <NavLinks className="space-y-1" onItemClick={closeSheet} />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}