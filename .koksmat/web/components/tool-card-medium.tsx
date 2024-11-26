'use client'

import React, { useContext, useState } from 'react'
import { ToolView } from '@/app/tools/schemas/forms'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ToolCard from './tool-card-large'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import Tag, { TagType } from './tag'
import { ComponentDoc } from './component-documentation-hub'
import { FavoriteComponent } from './favorite'
import { kError, kVerbose } from '@/lib/koksmat-logger-client'
import { useKoksmatDatabase } from '@/app/koksmat/src/v.next/components/database-context-provider'
import { databaseActions } from '@/app/tools/schemas/database'
import { MagicboxContext } from '@/app/koksmat0/magicbox-context'

interface ToolCardMediumProps {
  tool: ToolView
  isFavorite: boolean

  allowedTags: TagType[]
  showActions?: boolean
}

export function ToolCardMediumComponent({ tool, allowedTags, isFavorite, showActions }: ToolCardMediumProps) {
  const actionName = "createOrUpdateTool"
  //const [isFavorite, setIsFavorite] = useState(tool.status === 'active')
  const [edit, setedit] = useState(false)
  const action = databaseActions.getAction(actionName)
  const table = useKoksmatDatabase().table("", action!.databaseName, action!.inputSchema)

  const magicbox = useContext(MagicboxContext)




  return (
    <Card className="w-64 h-72 flex flex-col">
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-4 ">
          <div className="flex flex-wrap gap-1">
            <Tag
              tags={allowedTags}
              initialSelectedTags={tool.category ? [tool.category] : []}
              allowMulti={false}
              required={false}
              mode={'view'}
            // onChange={(_, selectedTags) => handleChange('tags', selectedTags)}


            />
          </div>
          <FavoriteComponent
            mode="edit"
            email={magicbox.user?.email}
            tool_id={tool.id}
            defaultIsFavorite={isFavorite}
          />
        </div>
        <div className="flex flex-col items-center mb-0">
          <div className="w-16 h-16 mb-0">
            <img
              src={tool.icon || '/placeholder.svg'}
              alt={tool.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-center h-24 ">
            <div className="text-center text-lg font-semibold">
              {tool.name}
            </div>
          </div>

        </div>
        <div className="flex justify-between items-center px-4 mt-3">
          <Dialog >
            <DialogTrigger asChild>
              <Button onClick={e => e.stopPropagation()} variant="outline" size="sm">Read More</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <ToolCard
                tool={tool}
                mode={edit ? 'edit' : 'view'}
                allowedTags={allowedTags}
                isFavorite={isFavorite}
                onSave={async (data, mode) => {
                  kVerbose("component", "ToolCardMediumComponent onSave", data, mode)

                  try {
                    const writeOperation = await table.execute(actionName, data)
                    setedit(false)
                    kVerbose("component", "ToolCardMediumComponent onSave completed", writeOperation)
                  } catch (error) {
                    kError("component", "onSave", error)
                  }


                }}
                allowedPurposes={[]} allowedCountries={[]} />

              {showActions && (
                <DialogFooter>
                  <Button onClick={e => { e.stopPropagation(); setedit(!edit) }} variant="ghost" size="sm">Edit</Button>
                </DialogFooter>)}
            </DialogContent>

          </Dialog>
          <Link href={tool.url} target="_blank" rel="noopener noreferrer">
            <Button disabled={!tool.url} onClick={e => e.stopPropagation()} variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Tool
            </Button>
          </Link>
        </div>
        {/* <p className="text-sm text-gray-600 line-clamp-3">{tool.description}</p> */}
      </CardContent>
      {/* <CardFooter className="flex justify-between items-center px-4">

      </CardFooter> */}
    </Card >
  )
}

// Example usage
function ToolCardMediumExample() {
  const [tool, setTool] = useState<ToolView>({
    id: 1,
    created_at: new Date(),
    created_by: 'John Doe',
    updated_at: new Date(),
    updated_by: 'Jane Smith',
    deleted_at: null,
    deletedBy: null,
    name: 'Nexi Connect',
    category: { id: 1, value: 'Category 1', color: '#ff0000', order: "" },
    description: `Il servizio per chiedere assistenza sulla dotazione tecnologica aziendale, tramite:

Ticket
Chat
Telefono
    
    `,
    url: 'https://nets.service-now.com/sp',
    groupId: 'tools-group',
    purposes: [],
    tags: [{
      "id": 1, "value": "Tag 1", "color": "#ff0000",
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
    { id: 1, value: 'tag1', color: '#ff0000', description: 'Tag 1', order: "1" },
    { id: 2, value: 'tag2', color: '#00ff00', description: 'Tag 2', order: "2" },
    { id: 3, value: "tag3", color: '#0000ff', description: 'Tag 3', order: "3" },
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

        allowedTags={allowedTags} isFavorite={false} />
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
import { Tool } from '@/app/tools/api/entity/schemas'
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