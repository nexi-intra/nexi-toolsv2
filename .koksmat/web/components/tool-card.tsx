'use client'

import React, { useState, useEffect } from 'react'
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
  allowedTags: { name: string; color: string; description: string }[]
  isFavorite: boolean
  onFavoriteChange: (isFavorite: boolean) => void
}

export default function ToolCard({
  tool: initialTool,
  mode,
  onSave,
  className = '',
  allowedTags,
  isFavorite,
  onFavoriteChange
}: ToolCardProps) {
  const [tool, setTool] = useState<Tool>(initialTool)

  useEffect(() => {
    setTool(initialTool)
  }, [initialTool])

  const handleChange = (field: keyof Tool, value: any) => {
    setTool(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(tool, mode)
    }
  }

  const handleFavoriteChange = (mode: 'view' | 'edit' | 'new', newFavoriteState: boolean) => {
    onFavoriteChange(newFavoriteState)
    handleChange('status', newFavoriteState ? 'active' : 'inactive')
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex grow">
          <IconUploader
            size={48}
            mode={mode}
            onUpdate={(_, icon) => handleChange('icon', icon)}
            initialIcon={tool.icon}
            className="w-[48px] h-[48px]"
          />
          <OneLineTextComponent
            initialValue={tool.name}
            placeholder="Enter tool name"
            mode={mode}
            onChange={(_, value) => handleChange('name', value)}
            className='text-2xl font-bold ml-3'
          />
        </div>

        <div className="flex items-center space-x-2">
          <Tag
            tags={allowedTags}
            selectedTags={tool.tags.map(tag => tag.key)}
            allowMulti={false}
            required={false}
            mode={mode}
            onChange={(_, selectedTags) => handleChange('tags', selectedTags)}
            canEditTagList={false}
            className='right-0'
          />
          <FavoriteComponent
            mode={mode}
            onChange={handleFavoriteChange}
            defaultIsFavorite={isFavorite}
          />
        </div>
      </CardHeader>
      <CardContent>

        <MultiLineText
          initialValue={tool.description}
          placeholder="Enter tool description"
          mode={mode}
          onChange={(_, value) => handleChange('description', value)}
        />

        {tool && tool.documents && tool.documents?.length > 0 && (
          <div className='text-xl font-bold ml-2 mt-2'>
            Documents
          </div>

        )}
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
          />
        )}
        {mode === 'view' && (
          <div className="flex justify-center w-full mt-4">
            <Link href={tool.url} target="_blank">
              <Button variant="default">
                Open Tool
              </Button>
            </Link>
          </div>
        )}
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
    name: 'Nexi Connect',
    description: `Il servizio per chiedere assistenza sulla dotazione tecnologica aziendale, tramite:

Ticket
Chat
Telefono
    
    `,
    url: 'https://nets.service-now.com/sp',
    groupId: 'tools-group',
    purposes: [],
    tags: [],
    version: '1.0.0',
    status: 'active',
    icon: '/nexiconnect.png',
    documentationUrl: 'https://example.com/docs',

    supportContact: [],
    license: [],
    compatiblePlatforms: ['Windows', 'Mac', 'Linux'],
    systemRequirements: 'Node.js 14+',
    relatedToolIds: [],
    countries: [],
    repositoryUrl: 'https://github.com/example/sample-tool',
    collaborationType: [],
    documents: [
      { name: 'Manuale Utente', url: 'https://christianiabpos.sharepoint.com/sites/nexiintra-unit-gf-it/SiteAssets/SitePages/Nexi-Connect(1)/Nexi_Connect_Come_fare_per.pdf?web=1' },
      { name: 'Nexi Connect: il nuovo accesso al supporto IT', url: 'https://christianiabpos.sharepoint.com/sites/nexiintra-unit-gf-it/SitePages/it/Nexi-Connect.aspx' }
    ],
    teamSize: 5,
    primaryFocus: []
  })
  const [isFavorite, setIsFavorite] = useState(false)

  const allowedTags = [
    { name: 'tag1', color: '#ff0000', description: 'Tag 1' },
    { name: 'tag2', color: '#00ff00', description: 'Tag 2' },
    { name: 'tag3', color: '#0000ff', description: 'Tag 3' },
  ]

  const handleSave = (updatedTool: Tool, saveMode: 'view' | 'edit' | 'new') => {
    console.log('Saved:', updatedTool, 'Mode:', saveMode)
    setTool(updatedTool)
    setMode('view')
  }

  const handleFavoriteChange = (newFavoriteState: boolean) => {
    setIsFavorite(newFavoriteState)
    console.log('Favorite changed:', newFavoriteState)
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
          allowedTags={allowedTags}
          isFavorite={isFavorite}
          onFavoriteChange={handleFavoriteChange}
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
    description: 'ToolCard component with view/edit/new mode selector, allowed tags, and favorite management',
    usage: `
import React, { useState } from 'react'
import { Tool } from '@/app/api/entity/schemas'
import ToolCard from './ToolCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ToolCardExample() {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [tool, setTool] = useState<Tool>({
    // ... (tool properties)
  })
  const [isFavorite, setIsFavorite] = useState(false)

  const allowedTags = [
    { name: 'tag1', color: '#ff0000', description: 'Tag 1' },
    { name: 'tag2', color: '#00ff00', description: 'Tag 2' },
    { name: 'tag3', color: '#0000ff', description: 'Tag 3' },
  ]

  const handleSave = (updatedTool: Tool, saveMode: 'view' | 'edit' | 'new') => {
    console.log('Saved:', updatedTool, 'Mode:', saveMode)
    setTool(updatedTool)
    setMode('view')
  }

  const handleFavoriteChange = (newFavoriteState: boolean) => {
    setIsFavorite(newFavoriteState)
    console.log('Favorite changed:', newFavoriteState)
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
          allowedTags={allowedTags}
          isFavorite={isFavorite}
          onFavoriteChange={handleFavoriteChange}
        />
      </CardContent>  
    </Card>
  )
}
    `,
    example: <ToolCardExample />,
  },
]