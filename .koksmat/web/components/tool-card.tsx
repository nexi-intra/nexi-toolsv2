'use client'

import React, { useState } from 'react'
import { ComponentDoc } from './component-documentation-hub'
import { Tool } from '@/app/api/entity/schemas'
import IconUploader from './icon-uploader'
import Tag from './tag'
import OneLineTextComponent from './one-line-text'
import MultiLineText from './multi-line-text'
import { FavoriteComponent } from './favorite'
import { FileLinksGridComponent } from './file-links-grid'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

interface ToolCardProps {
  tool: Tool
  mode: 'view' | 'edit' | 'new'
  onSave?: (data: Tool, mode: 'view' | 'edit' | 'new') => void
  className?: string
}

export default function ToolCard({ tool: initialTool, mode, onSave, className = '' }: ToolCardProps) {
  const [tool, setTool] = useState<Tool>(initialTool)

  const handleChange = (field: keyof Tool, value: any) => {
    setTool(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(tool, mode)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <Tag
            tags={tool.tagIds.map(id => ({ name: id, color: '#0075ca', description: '' }))}
            selectedTags={tool.tagIds}
            allowMulti={false}
            required={false}
            mode={mode}
            onChange={(_, selectedTags) => handleChange('tagIds', selectedTags)}
            canEditTagList={false}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <IconUploader
            mode={mode}
            onUpdate={(_, icon) => handleChange('icon', icon)}
            initialIcon={tool.icon}
            className="w-[100px] h-[100px]"
          />
        </div>
        <div className="flex-1 flex justify-end">
          <FavoriteComponent
            mode={mode}
            onChange={(_, isFavorite) => handleChange('status', isFavorite ? 'active' : 'inactive')}
            defaultIsFavorite={false}
          />
        </div>
      </CardHeader>
      <CardContent>
        <OneLineTextComponent
          initialValue={tool.name}
          placeholder="Enter tool name"
          mode={mode}
          onChange={(_, value) => handleChange('name', value)}
          className='text-2xl font-bold '
        />
        <MultiLineText
          initialValue={tool.description}
          placeholder="Enter tool description"
          mode={mode}
          onChange={(_, value) => handleChange('description', value)}
        />
        <FileLinksGridComponent
          initialLinks={tool.documents?.map((doc, index) => ({
            id: index.toString(),
            name: doc.name,
            url: doc.url,
            type: 'pdf'
          })) || []}
          mode={mode}
          columns={mode === "view" ? 2 : 1}
          onUpdate={(_, links) => handleChange('documents', links.map(link => ({ name: link.name, url: link.url })))}
        />
        {mode !== 'view' && (
          <OneLineTextComponent
            initialValue={tool.url}
            placeholder="Enter tool url"
            mode={mode}
            onChange={(_, value) => handleChange('url', value)}

          />)
        }
        {mode === 'view' && (
          <div className="flex justify-center w-full mt-4">
            <Link href={tool.url} target="_blank" >
              {/* make the button centered */}
              <Button variant="default" className="" >
                Open Tool
              </Button></Link>
          </div>
        )
        }
      </CardContent>
      <CardFooter className="flex justify-end">
        {mode !== 'view' && (
          <Button onClick={handleSave}>
            {mode === 'new' ? 'Create' : 'Save'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Example component
function ToolCardExample() {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [tool, setTool] = useState<Tool>({
    id: '1',
    createdAt: new Date(),
    createdBy: 'John Doe',
    updatedAt: new Date(),
    updatedBy: 'Jane Smith',
    deletedAt: null,
    deletedBy: null,
    name: 'Sample Tool',
    description: 'This is a sample tool for demonstration purposes.',
    url: 'https://example.com/sample-tool',
    groupId: 'tools-group',
    purposeIds: ['purpose1', 'purpose2'],
    tagIds: ['tag1', 'tag2'],
    version: '1.0.0',
    status: 'active',
    icon: '/placeholder.svg',
    documentationUrl: 'https://example.com/docs',
    supportContact: 'support@example.com',
    license: 'MIT',
    compatiblePlatforms: ['Windows', 'Mac', 'Linux'],
    systemRequirements: 'Node.js 14+',
    relatedToolIds: ['tool2', 'tool3'],
    countries: ['US', 'UK', 'CA'],
    repositoryUrl: 'https://github.com/example/sample-tool',
    collaborationType: 'Open Source',
    documents: [
      { name: 'User Guide', url: 'https://example.com/user-guide.pdf' },
      { name: 'API Documentation', url: 'https://example.com/api-docs.pdf' }
    ],
    teamSize: 5,
    primaryFocus: 'Development'
  })

  const handleSave = (updatedTool: Tool, saveMode: 'view' | 'edit' | 'new') => {
    console.log('Saved:', updatedTool, 'Mode:', saveMode)
    setTool(updatedTool)
    setMode('view')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ToolCard Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={mode} onValueChange={(value: 'view' | 'edit' | 'new') => setMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
        <ToolCard
          tool={tool}
          mode={mode}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}

// Example usage documentation
export const examplesToolCard: ComponentDoc[] = [
  {
    id: 'ToolCard-AllModes',
    name: 'ToolCard - All Modes',
    description: 'ToolCard component with view/edit/new mode selector',
    usage: `
import React, { useState } from 'react'
import { Tool } from '@/app/api/entity/schemas'
import ToolCard from './ToolCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ToolCardExample() {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [tool, setTool] = useState<Tool>({
    id: '1',
    createdAt: new Date(),
    createdBy: 'John Doe',
    updatedAt: new Date(),
    updatedBy: 'Jane Smith',
    deletedAt: null,
    deletedBy: null,
    name: 'Sample Tool',
    description: 'This is a sample tool for demonstration purposes.',
    url: 'https://example.com/sample-tool',
    groupId: 'tools-group',
    purposeIds: ['purpose1', 'purpose2'],
    tagIds: ['tag1', 'tag2'],
    version: '1.0.0',
    status: 'active',
    icon: '/placeholder.svg')',
    documentationUrl: 'https://example.com/docs',
    supportContact: 'support@example.com',
    license: 'MIT',
    compatiblePlatforms: ['Windows', 'Mac', 'Linux'],
    systemRequirements: 'Node.js 14+',
    relatedToolIds: ['tool2', 'tool3'],
    countries: ['US', 'UK', 'CA'],
    repositoryUrl: 'https://github.com/example/sample-tool',
    collaborationType: 'Open Source',
    documents: [
      { name: 'User Guide', url: 'https://example.com/user-guide.pdf' },
      { name: 'API Documentation', url: 'https://example.com/api-docs.pdf' }
    ],
    teamSize: 5,
    primaryFocus: 'Development'
  })

  const handleSave = (updatedTool: Tool, saveMode: 'view' | 'edit' | 'new') => {
    console.log('Saved:', updatedTool, 'Mode:', saveMode)
    setTool(updatedTool)
    setMode('view')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ToolCard Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={mode} onValueChange={(value: 'view' | 'edit' | 'new') => setMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
            <SelectItem value="new">New</SelectItem>
          </SelectContent>
        </Select>
        <ToolCard
          tool={tool}
          mode={mode}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}
    `,
    example: <ToolCardExample />,
  },
]