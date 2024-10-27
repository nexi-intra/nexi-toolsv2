'use client'

import React, { useState, useEffect } from 'react'
import { ComponentDoc } from './component-documentation-hub'
import { Tool } from '@/app/api/entity/schemas'
import IconUploader from './icon-uploader'
import TagSelector, { TagType } from './tag'
import OneLineTextComponent from './one-line-text'
import MultiLineText from './multi-line-text'
import { FavoriteComponent } from './favorite'
import { FileLinksGridComponent } from './file-links-grid'


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import KeyValueSelector from './lookup'
import Lookup from './lookup'
import { Globe } from 'lucide-react'

interface ToolCardProps {
  tool: Tool
  mode: 'view' | 'edit' | 'new'
  onSave?: (data: Tool, mode: 'view' | 'edit' | 'new') => void
  className?: string
  allowedTags: TagType[]
  allowedPurposes: { name: string; code: string; sortorder: string }[]
  allowedCountries: { name: string; code: string }[]
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
          <TagSelector
            tags={allowedTags}
            initialSelectedTags={tool.tags}
            allowMulti={false}
            required={false}
            mode={mode}
          //onChange={(_, selected) => handleChange('tags', selected)}

          // className='right-0'
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

        {tool && tool.countries && tool.countries.length > 0 && (
          <div className='text-xl font-bold ml-2 mt-2'>
            Countries
          </div>

        )}
        <Lookup
          className='p-2'
          renderItem={(item) => <span className='flex '><Globe className='h-6 w-6 mt-1 mr-2' />{item.value}</span>}

          items={tool.countries?.map((country, index) => ({ id: country.id, value: country.value, sortorder: country.order })) ?? []}
          mode={mode}

          required={true}


        />


        {tool && tool.purposes && tool.purposes.length > 0 && (
          <div className='text-xl font-bold ml-2 mt-2'>
            Purposes
          </div>

        )}
        <Lookup
          className='p-2'
          items={tool.purposes?.map((purpose, index) => ({ id: purpose.id, value: purpose.value, sortorder: purpose.order })) ?? []}
          mode={mode}

          required={true}


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
    purposes: [{ value: 'Purpose 1', id: 'PUR1', order: '1' }, { value: 'Purpose 2', id: 'PUR2', order: '2' }],
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
    countries: [{ value: 'Italy', id: 'it', order: '1' }],
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
    { id: 'tag1', value: 'tag1', color: '#ff0000', description: 'Tag 1', order: "1" },
    { id: 'tag2', value: 'tag2', color: '#00ff00', description: 'Tag 2', order: "2" },
    { id: 'tag3', value: 'tag2', color: '#0000ff', description: 'Tag 3', order: "3" },
  ]

  const allowedCountries = [
    { name: 'Italy', code: 'it' },
    { name: 'France', code: 'fr' },
    { name: 'Germany', code: 'de' },
  ]

  const allowedPurposes = [
    { name: 'Purpose 1', code: 'PUR1', sortorder: '1' },
    { name: 'Purpose 2', code: 'PUR2', sortorder: '2' },
    { name: 'Purpose 3', code: 'PUR3', sortorder: '3' },
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
    <>
      <Card className="w-full  mx-auto">
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
            allowedCountries={allowedCountries}
            allowedPurposes={allowedPurposes}
            isFavorite={isFavorite}
            onFavoriteChange={handleFavoriteChange}
          />
        </CardContent>
      </Card>
      {/* <pre>
        {JSON.stringify(tool, null, 2)}
      </pre> */}
    </>
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