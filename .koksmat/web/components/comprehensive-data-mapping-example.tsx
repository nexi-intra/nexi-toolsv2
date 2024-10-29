'use client'

import { useState } from 'react'
import { z } from 'zod'
import SimplifiedMonacoInputField from './simplified-monaco-input-field'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveMappingsToYaml } from '@/lib/mapping-persistence'


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

interface Mapping {
  [key: string]: string
}

export function ComprehensiveDataMappingExampleComponent() {
  const [activeTab, setActiveTab] = useState<MappingType>('serverToClient')
  const [mappings, setMappings] = useState<Record<MappingType, Mapping>>({
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
  })

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
    // Here you would typically send this YAML string to your backend
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
    <Card className="w-full max-w-4xl mx-auto">
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
        <Button onClick={handleSaveMapping}>Save Mapping</Button>
      </CardFooter>
    </Card>
  )
}