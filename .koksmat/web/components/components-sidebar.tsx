'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"
import { sidebarData, getTranslatedString, SidebarItem } from '../lib/types-sidebar-data'
import { cn } from "@/lib/utils"

interface SidebarComponentProps {
  language?: string;
  className?: string;
}

export function SidebarComponent({ language = 'en', className }: SidebarComponentProps) {
  const pathname = usePathname()

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton asChild isActive={pathname === item.url}>
          <Link href={item.url || '#'} className="flex items-center gap-3">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{getTranslatedString(item.label, language)}</span>
          </Link>
        </SidebarMenuButton>
        {item.children && item.children.length > 0 && (
          <SidebarMenu>{renderSidebarItems(item.children)}</SidebarMenu>
        )}
      </SidebarMenuItem>
    ))
  }

  return (
    <SidebarProvider>
      <Sidebar className={cn("border-r", className)}>
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">
            {getTranslatedString(sidebarData.header.title, language)}
          </h2>
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.content.map((section) => (
            <div key={section.id} className="mb-4">
              {section.title && (
                <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
                  {getTranslatedString(section.title, language)}
                </h3>
              )}
              <SidebarMenu>
                {renderSidebarItems(section.items)}
              </SidebarMenu>
            </div>
          ))}
        </SidebarContent>
        {sidebarData.footer && (
          <div className="mt-auto p-4 text-sm text-muted-foreground">
            {getTranslatedString(sidebarData.footer.content, language)}
          </div>
        )}
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}