'use client'

import React from 'react'
import { ComponentDoc } from './component-documentation-hub'
import { SidebarComponent } from './components-sidebar'


export const examplesSidebar: ComponentDoc[] = [
  {
    id: 'Sidebar',
    name: 'Sidebar',
    description: 'A flexible sidebar component that uses data from sidebar-data.ts. It supports translations, Lucide icons, and nested menu items.',
    usage: `
import SidebarComponent from './components/Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex">
      <SidebarComponent language="en" />
      <main>{children}</main>
    </div>
  )
}
    `,
    example: (
      <div className="h-[500px] w-full max-w-[300px] border">
        <SidebarComponent language="en" />
      </div>
    )
  }
]