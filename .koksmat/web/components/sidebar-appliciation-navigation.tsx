'use client'

import * as React from 'react'
import { nanoid } from 'nanoid'
import { ChevronRight, ExternalLink, FileText, FolderOpen, Link2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TreeEditor } from './tree-editor'
import { ActionType } from './action-selector'
import type { EditorData } from './tree-editor-components'

interface SidebarDesignerProps {
  defaultValue?: EditorData
  onChange?: (data: EditorData) => void
  className?: string
}

export default function SidebarApplicationDesigner({
  defaultValue = [],
  onChange = () => { },
  className = ''
}: SidebarDesignerProps) {
  // Define available actions for navigation items
  const navigationActions: ActionType[] = [
    {
      id: 'none',
      title: 'None',
      description: 'No action',
      actionType: 'none',
      properties: {}
    },
    {
      id: 'link',
      title: 'Internal Link',
      description: 'Navigate to an internal page',
      actionType: 'link',
      properties: {
        path: '/example',
        preserveQuery: false
      }
    },
    {
      id: 'external',
      title: 'External Link',
      description: 'Open an external URL',
      actionType: 'external',
      properties: {
        url: 'https://example.com',
        target: '_blank'
      }
    },
    {
      id: 'email',
      title: 'Email Link',
      description: 'Open email client',
      actionType: 'email',
      properties: {
        email: 'example@example.com',
        subject: '',
        body: ''
      }
    }
  ]

  // Example initial data structure
  const initialData: EditorData = defaultValue.length ? defaultValue : [

  ]

  const [activeData, setActiveData] = React.useState<EditorData>(initialData)

  const handleChange = (data: EditorData) => {
    setActiveData(data)
    onChange(data)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sidebar Designer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Navigation</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0">
            <TreeEditor
              initialData={activeData}
              onChange={handleChange}
              actions={navigationActions}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <Card className="w-64 h-[600px] border-2 border-dashed">
              <CardContent className="p-4">
                <PreviewNavigation items={activeData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Preview component for the navigation
function PreviewNavigation({ items }: { items: EditorData }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            {item.icon === 'Folder' ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {item.text}
          </div>
          {item.children && item.children.length > 0 && (
            <div className="ml-4 space-y-1">
              {item.children.map((child) => (
                <PreviewItem key={child.id} item={child} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Preview component for individual navigation items
function PreviewItem({ item }: { item: EditorData[0] }) {
  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'external':
        return <ExternalLink className="h-3 w-3 ml-1" />
      case 'email':
        return <Mail className="h-3 w-3 ml-1" />
      case 'link':
      default:
        return <Link2 className="h-3 w-3 ml-1" />
    }
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        className="w-full justify-start px-2 py-1 h-8 text-sm font-normal"
      >
        <div className="flex items-center gap-2">
          {item.icon === 'Folder' ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span>{item.text}</span>
          {item.action && (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              {getActionIcon(item.action.actionType)}
            </span>
          )}
        </div>
      </Button>
      {item.children && item.children.length > 0 && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child) => (
            <PreviewItem key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}