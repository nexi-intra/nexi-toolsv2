'use client'

import SidebarLayout from '@/components/layout/sidebar-layout-server'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarLayout rootFolder="app">
          {children}
        </SidebarLayout>
      </body>
    </html>
  )
}