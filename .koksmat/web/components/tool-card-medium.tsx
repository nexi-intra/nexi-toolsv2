'use client'

import React, { useContext, useState } from 'react'
import { SupportedLanguage, useLanguage } from "@/components/language-context"

import { ToolView } from '@/app/tools/schemas/forms'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
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
import { z } from "zod";



const translationSchema = z.object({
  teams: z.string(),
  addTeam: z.string(),
  platform: z.string(),
  projects: z.string(),
  more: z.string(),
  buildingYourApplication: z.string(),
  dataFetching: z.string(),
  language: z.string(),
  darkMode: z.string(),
  lightMode: z.string(),
  enterToolName: z.string(),
  enterToolDescription: z.string(),
  countries: z.string(),
  purposes: z.string(),
  documents: z.string(),
  enterToolUrl: z.string(),
  openTool: z.string(),
  create: z.string(),
  save: z.string(),
  readMore: z.string(),
  toolCardMediumExample: z.string(),
});

export type Translation = z.infer<typeof translationSchema>;

const translations: Record<SupportedLanguage, Translation> = {
  en: {
    teams: "Versions",
    addTeam: "Add Configuration",
    platform: "Solution",
    projects: "Projects",
    more: "More",
    buildingYourApplication: "Building Your Application",
    dataFetching: "Data Fetching",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    enterToolName: "Enter tool name",
    enterToolDescription: "Enter tool description",
    countries: "Countries",
    purposes: "Purposes",
    documents: "Documents",
    enterToolUrl: "Enter tool url",
    openTool: "Open Tool",
    create: "Create",
    save: "Save",
    readMore: "Read More",
    toolCardMediumExample: "ToolCardMedium Example",
  },
  da: {
    teams: "Versioner",
    addTeam: "Tilføj opsætning",
    platform: "Solution",
    projects: "Projekter",
    more: "Mere",
    buildingYourApplication: "Byg din applikation",
    dataFetching: "Datahentning",
    language: "Sprog",
    darkMode: "Mørk tilstand",
    lightMode: "Lys tilstand",
    enterToolName: "Indtast værktøjsnavn",
    enterToolDescription: "Indtast værktøjsbeskrivelse",
    countries: "Lande",
    purposes: "Formål",
    documents: "Dokumenter",
    enterToolUrl: "Indtast værktøjs-url",
    openTool: "Åbn værktøj",
    create: "Opret",
    save: "Gem",
    readMore: "Læs mere",
    toolCardMediumExample: "ToolCardMedium Eksempel",
  },
  it: {
    teams: "Versioni",
    addTeam: "Aggiungi Configurazione",
    platform: "Soluzione",
    projects: "Progetti",
    more: "Altro",
    buildingYourApplication: "Costruisci la tua applicazione",
    dataFetching: "Recupero dati",
    language: "Lingua",
    darkMode: "Modalità scura",
    lightMode: "Modalità chiara",
    enterToolName: "Inserisci il nome dello strumento",
    enterToolDescription: "Inserisci la descrizione dello strumento",
    countries: "Paesi",
    purposes: "Scopi",
    documents: "Documenti",
    enterToolUrl: "Inserisci l'URL dello strumento",
    openTool: "Apri strumento",
    create: "Crea",
    save: "Salva",
    readMore: "Leggi di più",
    toolCardMediumExample: "Esempio ToolCardMedium",
  },
};

export default translations;


export function ToolCardMediumComponent({ tool, allowedTags, isFavorite, showActions }: ToolCardMediumProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const actionName = "createOrUpdateTool"
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
            <div className="text-center text-lg font-semibold leading-tight">
              {tool.name}
            </div>
          </div>
        </div>
        <div className="flex mt-3 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={e => e.stopPropagation()} variant="outline" size="sm">{t?.readMore}</Button>
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
                allowedPurposes={[]}
                allowedCountries={[]}
              />
              {showActions && (
                <DialogFooter>
                  <Button onClick={e => { e.stopPropagation(); setedit(!edit) }} variant="ghost" size="sm">Edit</Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
          <div className="grow min-w-5" />
          <Link href={tool.url} target="_blank" rel="noopener noreferrer">
            <Button disabled={!tool.url} onClick={e => e.stopPropagation()} variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t?.openTool}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ToolCardMediumExample() {
  const { language } = useLanguage();
  const t = translations[language];

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t?.toolCardMediumExample}</h2>
      <ToolCardMediumComponent
        tool={tool}
        allowedTags={allowedTags}
        isFavorite={false}
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
import { ToolView } from '@/app/tools/schemas/forms'
import { ToolCardMediumComponent } from './tool-card-medium-component'
import { useLanguage } from "@/components/language-context"
import translations from './translations'

function ToolCardMediumExample() {
  const { language } = useLanguage();
  const t = translations[language];

  const [tool, setTool] = useState<ToolView>({
    // ... (tool properties)
  })

  const allowedTags = [
    { id: 1, value: 'tag1', color: '#ff0000', description: 'Tag 1', order: "1" },
    { id: 2, value: 'tag2', color: '#00ff00', description: 'Tag 2', order: "2" },
    { id: 3, value: "tag3", color: '#0000ff', description: 'Tag 3', order: "3" },
  ]

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t?.toolCardMediumExample}</h2>
      <ToolCardMediumComponent
        tool={tool}
        allowedTags={allowedTags}
        isFavorite={false}
      />
    </div>
  )
}
    `,
    example: <ToolCardMediumExample />,
  },
]

