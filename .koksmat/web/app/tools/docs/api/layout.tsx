'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { APPNAME } from '@/app/global'
import { typeNames } from '../../schemas/forms'

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex min-h-screen">
      {/* Mobile burger menu */}
      <Button
        variant="ghost"
        className="fixed top-14 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-100 dark:bg-gray-800 overflow-y-auto fixed left-0 top-14 bottom-0 w-64 transition-transform duration-300 ease-in-out z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="p-4 h-full">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Documents</h2>
          <ul className="space-y-2">

            <li >
              <Link
                href={`/${APPNAME}/docs/api/swagger`}
                className={cn(
                  "block py-2 px-4 rounded-md transition-colors",
                  pathname === `/docs/api/swagger`
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                Open API Definition
              </Link>
            </li>

          </ul>
          <h2 className="text-lg font-semibold mb-4 mt-4 text-gray-700 dark:text-gray-200">Code samples</h2>
          <ul className="space-y-2">
            {Object.entries(typeNames).map(([name, displayName]) => (
              <li key={name}>
                <Link
                  href={`/${APPNAME}/docs/api/entity/${name}`}
                  className={cn(
                    "block py-2 px-4 rounded-md transition-colors",
                    pathname === `/docs/api/entity/${name}`
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {displayName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8  md:ml-64 overflow-y-auto">
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}