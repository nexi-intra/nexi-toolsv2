"use client"

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { SqlQueryEditor } from './sql-query-editor'
import { EntityDataMapping } from './data-mapper'
import { ComponentDoc } from './component-documentation-hub'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the schema for the component props
const FrontendDataMapperSchema = z.object({
  className: z.string().optional(),
  initialSchemaKey: z.string(),
  database: z.string(),
  sql: z.string(),
  schemasMap: z.record(z.any()),
})

// Infer the type from the schema
type FrontendDataMapperProps = z.infer<typeof FrontendDataMapperSchema>

/**
 * FrontendDataMapper - A component that integrates schema selection,
 * SQL query editing, and entity data mapping for frontend data operations.
 * It uses ResizablePanels to organize the SQL editor and dataset display.
 */
export function FrontendDataMapper({ className = '', initialSchemaKey, database, sql, schemasMap }: FrontendDataMapperProps) {
  const [selectedSchemaKey, setSelectedSchemaKey] = useState(initialSchemaKey)
  const [currentSql, setCurrentSql] = useState(sql)
  const [dataset, setDataset] = useState<any>(null)
  const [currentMapping, setCurrentMapping] = useState<Record<string, string>>({})

  const handleSchemaChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchemaKey(event.target.value)
  }, [])

  const handleSqlChange = useCallback((newSql: string) => {
    setCurrentSql(newSql)
  }, [])

  const handleNewInterface = useCallback((newDataset: any, interfaceDefinition: any) => {
    setDataset(newDataset)
    console.log('New interface definition:', interfaceDefinition)
  }, [])

  const handleMappingChange = useCallback(({ mapping }: { mapping: Record<string, string> }) => {
    console.log('Mapping changed to:', mapping)
    setCurrentMapping(mapping)
  }, [])

  const handleRunQuery = useCallback(() => {
    // Simulating query execution
    // In a real application, this would be an API call to execute the SQL query
    setTimeout(() => {
      const mockData = [
        { id: 1, name: "Tool 1", description: "Description 1", category: "Category A" },
        { id: 2, name: "Tool 2", description: "Description 2", category: "Category B" },
      ]
      setDataset(mockData)
    }, 1000)
  }, [])

  return (
    <>
      <ZeroTrust
        schema={FrontendDataMapperSchema}
        props={{ className, initialSchemaKey, database, sql, schemasMap }}
        actionLevel="error"
        componentName="FrontendDataMapper"
      />
      <div className={`frontend-data-mapper ${className} w-full`}>
        <div className="mb-4">
          <label htmlFor="schema-select" className="block text-sm font-medium text-gray-700 mb-1">Select Schema:</label>
          <select
            id="schema-select"
            value={selectedSchemaKey}
            onChange={handleSchemaChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            {Object.keys(schemasMap).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">SQL Query Editor</h2>
              <SqlQueryEditor
                database={database}
                sql={currentSql}
                name="SQL Query"
                onChange={handleSqlChange}
                mode="edit"
                onModeChange={(mode, data) => console.log('Mode changed:', mode, data)}
                onNewInterface={handleNewInterface}
              />
              <Button onClick={handleRunQuery} className="mt-4">Run Query</Button>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Dataset & Mapping</h2>
              {dataset ? (
                <>
                  <EntityDataMapping
                    targetSchema={schemasMap[selectedSchemaKey]}
                    sampleItem={dataset[0]}
                    initialMapping={{}}
                    onChange={handleMappingChange}
                    className="border border-gray-300 rounded-md p-4"
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Mapping</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(currentMapping).length > 0 ? (
                        <ul className="list-disc list-inside">
                          {Object.entries(currentMapping).map(([key, value]) => (
                            <li key={key} className="text-sm">
                              <span className="font-semibold">{key}</span>: {value}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No mapping defined yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No dataset available</AlertTitle>
                  <AlertDescription>
                    Run a SQL query to fetch data and start mapping.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}

// Example usage documentation
export const examplesFrontendDataMapper: ComponentDoc[] = [
  {
    id: 'FrontendDataMapper',
    name: 'FrontendDataMapper',
    description: 'A component integrating schema selection, SQL query editing, and entity data mapping for frontend data operations, organized in resizable panels. It now includes a view of the current mapping.',
    usage: `
import { FrontendDataMapper } from './frontend-data-mapper'
import { z } from 'zod'

const exampleSchemasMap = {
  ToolSchema: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
  }),
  UserSchema: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    role: z.string(),
  }),
}

<FrontendDataMapper
  initialSchemaKey="ToolSchema"
  database="tools"
  sql="SELECT * FROM tools"
  schemasMap={exampleSchemasMap}
  className="custom-frontend-data-mapper"
/>
    `,
    example: (
      <FrontendDataMapper
        initialSchemaKey="ToolSchema"
        database="tools"
        sql="SELECT * FROM tools"
        schemasMap={{
          ToolSchema: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            category: z.string(),
          }),
          UserSchema: z.object({
            id: z.number(),
            username: z.string(),
            email: z.string().email(),
            role: z.string(),
          }),
        }}
        className="custom-frontend-data-mapper"
      />
    ),
  },
]