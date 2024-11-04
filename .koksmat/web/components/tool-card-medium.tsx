'use client'

import React, { useState } from 'react'
import { Tool } from '@/app/tools/api/entity/schemas'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ToolCard from './tool-card'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Tag, { TagType } from './tag'
import { ComponentDoc } from './component-documentation-hub'
import { FavoriteComponent } from './favorite'

interface ToolCardMediumProps {
  tool: Tool
  onFavoriteChange: (isFavorite: boolean) => void
  allowedTags: TagType[]
}

export function ToolCardMediumComponent({ tool, onFavoriteChange, allowedTags }: ToolCardMediumProps) {
  const [isFavorite, setIsFavorite] = useState(tool.status === 'active')

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    onFavoriteChange(newFavoriteState)
  }

  return (
    <Card className="w-64 h-80 flex flex-col">
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-4 ">
          <div className="flex flex-wrap gap-1">
            <Tag
              tags={allowedTags}
              initialSelectedTags={tool.tags}
              allowMulti={false}
              required={false}
              mode={'view'}
            // onChange={(_, selectedTags) => handleChange('tags', selectedTags)}


            />
          </div>
          <FavoriteComponent
            mode="view"

            defaultIsFavorite={isFavorite} onChange={function (mode: 'view' | 'new' | 'edit', isFavorite: boolean): void {
              //throw new Error('Function not implemented.')
            }} />
        </div>
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 mb-2">
            <Image
              src={tool.icon || '/placeholder.svg'}
              alt={tool.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-center">{tool.name}</h3>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{tool.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Read More</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <ToolCard
              tool={tool}
              mode="view"
              allowedTags={allowedTags}
              isFavorite={isFavorite}
              onFavoriteChange={onFavoriteChange} allowedPurposes={[]} allowedCountries={[]} />
          </DialogContent>
        </Dialog>
        <Link href={tool.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Tool
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Example usage
function ToolCardMediumExample() {
  const [tool, setTool] = useState<Tool>({
    id: 1,
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
    tags: [{
      "id": "tag1", "value": "Tag 1", "color": "#ff0000",
      order: ''
    }],
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

  const allowedTags = [
    { id: "tag1", value: 'tag1', color: '#ff0000', description: 'Tag 1', order: "1" },
    { id: "tag2", value: 'tag2', color: '#00ff00', description: 'Tag 2', order: "2" },
    { id: 'tag3', value: "tag3", color: '#0000ff', description: 'Tag 3', order: "3" },
  ]

  const handleFavoriteChange = (isFavorite: boolean) => {
    setTool(prevTool => ({
      ...prevTool,
      status: isFavorite ? 'active' : 'inactive'
    }))
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">ToolCardMedium Example</h2>
      <ToolCardMediumComponent
        tool={tool}
        onFavoriteChange={handleFavoriteChange}
        allowedTags={allowedTags}
      />
    </div>
  )
}

export const examplesToolCardMedium: ComponentDoc[] = [
  {
    id: 'ToolCardMedium-Example',
    name: 'ToolCardMedium',
    description: 'A medium-sized card for tools with a pop-up detailed view',
    usage: `
import React, { useState } from 'react'
import { Tool } from '@/app/api/entity/schemas'
import ToolCardMedium from './ToolCardMedium'

function ToolCardMediumExample() {
  const [tool, setTool] = useState<Tool>({
    id: '1',
    createdAt: new Date(),
    createdBy: 'John Doe',
    updatedAt: new Date(),
    updatedBy: 'Jane Smith',
    deletedAt: null,
    deletedBy: null,
    name: 'Sample Tool',
    description: 'This is a sample tool for demonstration purposes. It has a longer description to show how text truncation works in the preview card.',
    url: 'https://example.com/sample-tool',
    groupId: 'tools-group',
    purposeIds: ['purpose1', 'purpose2'],
    tagIds: ['tag1', 'tag2', 'tag3'],
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

  const allowedTags = [
    { name: 'tag1', color: '#ff0000', description: 'Tag 1' },
    { name: 'tag2', color: '#00ff00', description: 'Tag 2' },
    { name: 'tag3', color: '#0000ff', description: 'Tag 3' },
  ]

  const handleFavoriteChange = (isFavorite: boolean) => {
    setTool(prevTool => ({
      ...prevTool,
      status: isFavorite ? 'active' : 'inactive'
    }))
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">ToolCardMedium Example</h2>
      <ToolCardMedium
        tool={tool}
        onFavoriteChange={handleFavoriteChange}
        allowedTags={allowedTags}
      />
    </div>
  )
}
    `,
    example: <ToolCardMediumExample />,
  },
]