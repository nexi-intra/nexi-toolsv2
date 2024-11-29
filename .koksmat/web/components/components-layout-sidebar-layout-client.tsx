'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight, Folder, File } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileStructure {
  [key: string]: {
    type: 'folder' | 'file'
    children?: FileStructure
  }
}

interface SidebarLayoutClientProps {
  children: React.ReactNode
  rootFolder: string
  fileStructure: FileStructure
  rootPath: string
}

const SidebarLayoutClient: React.FC<SidebarLayoutClientProps> = ({ children, rootFolder, fileStructure, rootPath }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
  }

  const renderFileStructure = (structure: FileStructure, currentPath: string = '') => {
    return Object.entries(structure).map(([name, item]) => {
      const path = `${currentPath}/${name}`
      const isExpanded = expandedFolders.includes(path)

      if (item.type === 'folder') {
        return (
          <div key={path}>
            <button
              onClick={() => toggleFolder(path)}
              className={cn(
                "flex items-center w-full px-2 py-1 text-sm transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname.startsWith(`${rootPath}${path}`) && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              <Folder className="w-4 h-4 mr-2" />
              {name}
            </button>
            {isExpanded && item.children && (
              <div className="ml-4">
                {renderFileStructure(item.children, path)}
              </div>
            )}
          </div>
        )
      } else if (name === 'page.tsx') {
        const linkPath = `${rootPath}${currentPath}` || '/'
        return (
          <Link
            key={path}
            href={linkPath}
            className={cn(
              "flex items-center px-2 py-1 text-sm transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              pathname === linkPath && "bg-gray-100 dark:bg-gray-800 font-medium"
            )}
          >
            <File className="w-4 h-4 mr-2" />
            {currentPath.split('/').pop() || 'Home'}
          </Link>
        )
      }
      return null
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="sr-only">Toggle sidebar</span>
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{rootFolder}</h2>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <ScrollArea className="flex-grow">
            <nav className="p-4">
              {renderFileStructure(fileStructure)}
            </nav>
          </ScrollArea>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-auto transition-margin duration-300 ease-in-out",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default SidebarLayoutClient