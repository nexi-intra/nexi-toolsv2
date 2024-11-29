'use client'

import * as React from 'react'
import {
  BookOpen,
  Bug,
  ChevronRight,
  Code,
  Component,
  ExternalLink,
  FileText,
  FolderOpen,

  Globe,
  Link2,
  ListTodo,
  Mail,
  Server,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TreeEditor } from './tree-editor'
import { ActionType } from './action-selector'
import type { EditorData, TreeNode } from './tree-editor-components'

interface ProjectStructureProps {
  defaultValue?: EditorData
  onChange?: (data: EditorData) => void
  className?: string
}

export default function ProjectStructure({
  defaultValue = [],
  onChange = () => { },
  className = ''
}: ProjectStructureProps) {
  const projectActions: ActionType[] = [
    {
      id: 'action-none',
      title: 'None',
      description: 'No action',
      actionType: 'none',
      properties: {}
    },
    {
      id: 'action-fetch-components',
      title: 'Fetch Components',
      description: 'Dynamically fetch component documentation',
      actionType: 'fetch',
      properties: {
        endpoint: '/api/docs/components',
        updateInterval: 60,
        cacheStrategy: 'stale-while-revalidate'
      }
    },
    {
      id: 'action-fetch-api',
      title: 'Fetch API Documentation',
      description: 'Dynamically fetch API documentation',
      actionType: 'fetch',
      properties: {
        endpoint: '/api/docs/api',
        updateInterval: 60,
        cacheStrategy: 'stale-while-revalidate'
      }
    },
    {
      id: 'action-fetch-issues',
      title: 'Fetch Issues',
      description: 'Dynamically fetch project issues',
      actionType: 'fetch',
      properties: {
        endpoint: '/api/issues',
        type: ['features', 'tasks', 'bugs'],
        status: 'open',
        updateInterval: 30
      }
    },
    {
      id: 'action-fetch-branches',
      title: 'Fetch Branches',
      description: 'Dynamically fetch git branches',
      actionType: 'fetch',
      properties: {
        endpoint: '/api/git/branches',
        updateInterval: 300
      }
    },
    {
      id: 'action-fetch-instances',
      title: 'Fetch Instances',
      description: 'Dynamically fetch deployment instances',
      actionType: 'fetch',
      properties: {
        endpoint: '/api/instances',
        updateInterval: 60
      }
    }
  ]

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
        <CardTitle>Project Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Edit Structure</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0">
            <TreeEditor
              initialData={activeData}
              onChange={handleChange}
              actions={projectActions}
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

function PreviewItem({ item }: { item: EditorData[0] }) {
  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'fetch':
        return <Server className="h-3 w-3 ml-1" />
      case 'external':
        return <ExternalLink className="h-3 w-3 ml-1" />
      case 'link':
        return <Link2 className="h-3 w-3 ml-1" />
      default:
        return null
    }
  }

  const getItemIcon = (item: EditorData[0]) => {
    switch (item.text.toLowerCase()) {
      case 'components':
        return <Component className="h-4 w-4" />
      case 'api':
        return <Code className="h-4 w-4" />
      case 'features':
        return <Sparkles className="h-4 w-4" />
      case 'tasks':
        return <ListTodo className="h-4 w-4" />
      case 'bugs':
        return <Bug className="h-4 w-4" />
      case 'documentation':
        return <BookOpen className="h-4 w-4" />
      case 'instances':
        return <Server className="h-4 w-4" />
      case 'dns':
        return <Globe className="h-4 w-4" />
      default:
        return item.icon === 'Folder' ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <FileText className="h-4 w-4" />
        )
    }
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        className="w-full justify-start px-2 py-1 h-8 text-sm font-normal"
      >
        <div className="flex items-center gap-2">
          {getItemIcon(item)}
          <span>{item.text}</span>
          {item.action && item.action.actionType !== 'none' && (
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