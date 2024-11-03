'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import SimplifiedMonacoInputField from './simplified-monaco-input-field'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveMappingsToYaml } from '@/lib/mapping-persistence'
import { ZeroTrust } from '@/components/zero-trust'
import { ComponentDoc } from './component-documentation-hub'

// Define Zod schemas for client and server data structures
const ClientSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  emailAddress: z.string().email(),
  isActiveUser: z.boolean()
})

const ServerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  birth_date: z.string(),
  email: z.string().email(),
  is_active: z.boolean()
})

type MappingType = 'serverToClient' | 'clientToServerCreate' | 'clientToServerUpdate'
type Mode = 'view' | 'new' | 'edit'

interface Mapping {
  [key: string]: string
}

// Define the component props schema
const ComprehensiveDataMappingExampleComponentSchema = z.object({
  initialMappings: z.record(z.enum(['serverToClient', 'clientToServerCreate', 'clientToServerUpdate']), z.record(z.string(), z.string())).optional(),
  onSave: z.function().args(z.object({ mode: z.enum(['view', 'new', 'edit']), mappings: z.record(z.enum(['serverToClient', 'clientToServerCreate', 'clientToServerUpdate']), z.record(z.string(), z.string())) })).returns(z.void()),
  className: z.string().optional(),
  mode: z.enum(['view', 'new', 'edit']).optional()
})

type ComprehensiveDataMappingExampleComponentProps = z.infer<typeof ComprehensiveDataMappingExampleComponentSchema>

const defaultMappings: Record<MappingType, Mapping> = {
  serverToClient: {},
  clientToServerCreate: {},
  clientToServerUpdate: {}
}

export function ComprehensiveDataMappingExampleComponent(props: ComprehensiveDataMappingExampleComponentProps) {
  const [activeTab, setActiveTab] = useState<MappingType>('serverToClient')
  const [mode, setMode] = useState<Mode>(props.mode || 'view')
  const [mappings, setMappings] = useState<Record<MappingType, Mapping>>(defaultMappings)

  useEffect(() => {
    if (props.initialMappings) {
      setMappings(prevMappings => ({
        ...prevMappings,
        ...props.initialMappings
      }))
    }
  }, [props.initialMappings])

  useEffect(() => {
    if (props.mode) {
      setMode(props.mode)
    }
  }, [props.mode])

  const handleMappingChange = (field: string, value: string) => {
    setMappings(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }))
  }

  const handleSaveMapping = () => {
    const yamlString = saveMappingsToYaml(mappings)
    console.log('Saved mappings as YAML:', yamlString)
    props.onSave({ mode, mappings })
  }

  const renderMappingFields = () => {
    const sourceSchema = activeTab === 'serverToClient' ? ServerSchema : ClientSchema
    const targetSchema = activeTab === 'serverToClient' ? ClientSchema : ServerSchema
    const currentMapping = mappings[activeTab]

    return Object.keys(targetSchema.shape).map(field => (
      <div key={field} className="mb-4">
        <SimplifiedMonacoInputField
          value={currentMapping[field] || ''}
          onChange={(value) => handleMappingChange(field, value)}
          sourceSchema={sourceSchema}
          label={`${field} Mapping`}

        />
      </div>
    ))
  }

  return (
    <>
      <ZeroTrust
        schema={ComprehensiveDataMappingExampleComponentSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="ComprehensiveDataMappingExampleComponent"
      />
      <Card className={`w-full max-w-4xl mx-auto ${props.className || ''}`}>
        <CardHeader>
          <CardTitle>Comprehensive Data Mapping</CardTitle>
          <CardDescription>Define mappings between client and server data structures</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MappingType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="serverToClient">Server to Client</TabsTrigger>
              <TabsTrigger value="clientToServerCreate">Client to Server (Create)</TabsTrigger>
              <TabsTrigger value="clientToServerUpdate">Client to Server (Update)</TabsTrigger>
            </TabsList>
            <TabsContent value="serverToClient">
              <h3 className="text-lg font-semibold mb-2">Server to Client Mapping</h3>
              {renderMappingFields()}
            </TabsContent>
            <TabsContent value="clientToServerCreate">
              <h3 className="text-lg font-semibold mb-2">Client to Server Mapping (Create)</h3>
              {renderMappingFields()}
            </TabsContent>
            <TabsContent value="clientToServerUpdate">
              <h3 className="text-lg font-semibold mb-2">Client to Server Mapping (Update)</h3>
              {renderMappingFields()}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {mode !== 'view' && (
            <Button onClick={handleSaveMapping}>Save Mapping</Button>
          )}
        </CardFooter>
      </Card>
    </>
  )
}

// ComponentDoc examples remain unchanged