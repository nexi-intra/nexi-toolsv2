'use client'

import React, { useState, useEffect } from 'react'
import { z } from 'zod'

import { SqlQueryEditor } from './sql-query-editor'
import { ZeroTrust } from '@/components/zero-trust'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import yaml from 'js-yaml'
import { EntityDataMapping } from './data-mapper'

// Define the Zod schema for the mappings
const MappingsSchema = z.record(z.enum(['serverToClient', 'clientToServerCreate', 'clientToServerUpdate']), z.record(z.string(), z.string()))

// Define the Zod schema for the component props
const IntegrationDesignerSchema = z.object({
  clientDataSchema: z.any(), // This should be a Zod schema
  initialMapping: MappingsSchema.default({
    serverToClient: {},
    clientToServerCreate: {},
    clientToServerUpdate: {},
  }),
  onSave: z.function().args(z.object({
    mode: z.enum(['view', 'edit', 'new']),
    mappings: MappingsSchema,
    sqlQuery: z.string(),
  })),
  className: z.string().optional(),
  mode: z.enum(['view', 'edit', 'new']).default('view'),
  database: z.string(),
  sql: z.string(),
})

// Infer the type from the schema
type IntegrationDesignerProps = z.infer<typeof IntegrationDesignerSchema>

export default function IntegrationDesigner({
  clientDataSchema,
  initialMapping,
  onSave,
  className = '',
  mode = 'view',
  database,
  sql,
}: IntegrationDesignerProps) {
  const [currentMode, setCurrentMode] = useState(mode)
  const [mappings, setMappings] = useState(initialMapping)
  const [sqlQuery, setSqlQuery] = useState(sql)
  const [sampleItem, setsampleItem] = useState<any | null>(null)
  const [yamlSource, setYamlSource] = useState('')
  const [showClearMappingDialog, setShowClearMappingDialog] = useState(false)
  const [newInterfaceData, setNewInterfaceData] = useState<{ dataset: any, interfaceDefinition: any } | null>(null)

  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  useEffect(() => {
    const yamlString = yaml.dump(mappings)
    setYamlSource(yamlString)
  }, [mappings])

  const handleMappingSave = (mappings: any) => {
    // setMappings(newMappings)
    // onSave({ mode, mappings: newMappings, sqlQuery })
  }

  const handleSqlChange = (newSql: string) => {
    setSqlQuery(newSql)
  }

  const handleSqlSave = (mode: 'view' | 'edit' | 'new', data: { sql: string }) => {
    onSave({ mode, mappings, sqlQuery: data.sql })
  }

  const handleNewInterface = (dataset: any, interfaceDefinition: any) => {
    setNewInterfaceData({ dataset, interfaceDefinition })
    setShowClearMappingDialog(true)
  }

  const handleClearMapping = () => {
    if (newInterfaceData) {
      setMappings({
        serverToClient: {},
        clientToServerCreate: {},
        clientToServerUpdate: {},
      })
      console.log('New dataset:', newInterfaceData.dataset)
      console.log('New interface definition:', newInterfaceData.interfaceDefinition)
    }
    setShowClearMappingDialog(false)
    setNewInterfaceData(null)
  }

  const handleKeepMapping = () => {
    setShowClearMappingDialog(false)
    setNewInterfaceData(null)
  }

  return (
    <>
      <ZeroTrust
        schema={IntegrationDesignerSchema}
        props={{ clientDataSchema, initialMapping, onSave, className, mode, database, sql }}
        actionLevel="error"
        componentName="IntegrationDesigner"
      />
      <div className={`integration-designer ${className}`}>
        <Tabs defaultValue="mapping" className="w-full">
          <TabsList>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="sql">SQL Editor</TabsTrigger>
            <TabsTrigger value="yaml">YAML Source</TabsTrigger>
          </TabsList>
          <TabsContent value="mapping">
            <EntityDataMapping
              initialMapping={{}}
              onChange={handleMappingSave} targetSchema={clientDataSchema} sampleItem={sampleItem}
            />
          </TabsContent>
          <TabsContent value="sql">
            <SqlQueryEditor
              database={database}
              sql={sqlQuery}
              name="Backend Integration Query"
              onChange={handleSqlChange}
              mode={currentMode}
              onModeChange={handleSqlSave}
              onNewInterface={handleNewInterface}
            />
          </TabsContent>
          <TabsContent value="yaml">
            <div className="p-4 bg-gray-100 rounded-md">
              <pre className="whitespace-pre-wrap">{yamlSource}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={showClearMappingDialog} onOpenChange={setShowClearMappingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Current Mapping?</AlertDialogTitle>
            <AlertDialogDescription>
              A new interface has been detected. Do you want to clear the current mapping and update with the new interface?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleKeepMapping}>Keep Current Mapping</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearMapping}>Clear and Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}



// Example usage documentation
import { ComponentDoc } from './component-documentation-hub'

export const examplesIntegrationDesigner: ComponentDoc[] = [
  {
    id: 'IntegrationDesigner',
    name: 'IntegrationDesigner',
    description: 'A component for designing integrations with EntityDataMapping, SQL query editing, and YAML source view capabilities.',
    usage: `
import { z } from 'zod'
import IntegrationDesigner from './integration-designer'

const clientDataSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  emailAddress: z.string().email(),
  isActiveUser: z.boolean(),
})

const initialMappings = {
  serverToClient: {
    fullName: "item.first_name + ' ' + item.last_name",
    age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
    emailAddress: "item.email",
    isActiveUser: "item.is_active"
  },
  clientToServerCreate: {
    first_name: "item.fullName.split(' ')[0]",
    last_name: "item.fullName.split(' ').slice(1).join(' ')",
    birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
    email: "item.emailAddress",
    is_active: "item.isActiveUser"
  },
  clientToServerUpdate: {
    id: "item.id",
    first_name: "item.fullName.split(' ')[0]",
    last_name: "item.fullName.split(' ').slice(1).join(' ')",
    birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
    email: "item.emailAddress",
    is_active: "item.isActiveUser"
  }
}

function handleSave({ mode, mappings, sqlQuery }) {
  console.log('Mode:', mode)
  console.log('Mappings saved:', mappings)
  console.log('SQL Query:', sqlQuery)
  // Handle the saved mappings and SQL query
}

<IntegrationDesigner
  clientDataSchema={clientDataSchema}
  initialMapping={initialMappings}
  onSave={handleSave}
  className="my-custom-class"
  mode="edit"
  database="mix"
  sql="SELECT * FROM user"
/>
`,
    example: (
      <IntegrationDesigner
        clientDataSchema={z.object({
          fullName: z.string(),
          age: z.number(),
          emailAddress: z.string().email(),
          isActiveUser: z.boolean(),
        })}
        initialMapping={{
          serverToClient: {
            fullName: "item.first_name + ' ' + item.last_name",
            age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
            emailAddress: "item.email",
            isActiveUser: "item.is_active"
          },
          clientToServerCreate: {
            first_name: "item.fullName.split(' ')[0]",
            last_name: "item.fullName.split(' ').slice(1).join(' ')",
            birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
            email: "item.emailAddress",
            is_active: "item.isActiveUser"
          },
          clientToServerUpdate: {
            id: "item.id",
            first_name: "item.fullName.split(' ')[0]",
            last_name: "item.fullName.split(' ').slice(1).join(' ')",
            birth_date: "new Date(new Date().getFullYear() - item.age, 0, 1).toISOString()",
            email: "item.emailAddress",
            is_active: "item.isActiveUser"
          }
        }}
        onSave={({ mode, mappings, sqlQuery }) => {
          console.log('Mode:', mode)
          console.log('Mappings saved:', mappings)
          console.log('SQL Query:', sqlQuery)
        }}
        className="example-integration-designer"
        mode="edit"
        database="mix"
        sql="SELECT * FROM user"
      />
    ),
  }
]