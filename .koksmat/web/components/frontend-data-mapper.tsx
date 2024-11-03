"use client"

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { SqlQueryEditor } from './sql-query-editor'

import { ComponentDoc } from './component-documentation-hub'
import { EntityDataMapping } from './data-mapper'

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
 */
export function FrontendDataMapper({ className = '', initialSchemaKey, database, sql, schemasMap }: FrontendDataMapperProps) {
  const [selectedSchemaKey, setSelectedSchemaKey] = useState(initialSchemaKey)
  const [currentSql, setCurrentSql] = useState(sql)
  const [dataset, setDataset] = useState<any>(null)

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

  const handleMappingChange = useCallback(({ mapping }: { mapping: any }) => {
    console.log('Mapping changed to:', mapping)
  }, [])

  return (
    <>
      <ZeroTrust
        schema={FrontendDataMapperSchema}
        props={{ className, initialSchemaKey, database, sql, schemasMap }}
        actionLevel="error"
        componentName="FrontendDataMapper"
      />
      <div className={`frontend-data-mapper ${className}`}>
        <h1 className="text-2xl font-bold mb-4">Frontend Data Mapper</h1>
        <div className="mb-4">
          <label htmlFor="schema-select" className="block text-sm font-medium text-gray-700 mb-1">Select Schema:</label>
          <select
            id="schema-select"
            value={selectedSchemaKey}
            onChange={handleSchemaChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.keys(schemasMap).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <SqlQueryEditor
            database={database}
            sql={currentSql}
            name="SQL Query"
            onChange={handleSqlChange}
            mode="edit"
            onModeChange={(mode, data) => console.log('Mode changed:', mode, data)}
            onNewInterface={handleNewInterface}
          />
        </div>

        {dataset && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Entity Data Mapping</h2>
            <EntityDataMapping
              targetSchema={schemasMap[selectedSchemaKey]}
              sampleItem={dataset[0]}
              initialMapping={{}}
              onChange={handleMappingChange}
              className="border border-gray-300 rounded-md p-4"
            />
          </div>
        )}
      </div>
    </>
  )
}

// Example usage documentation
export const examplesFrontendDataMapper: ComponentDoc[] = [
  {
    id: 'FrontendDataMapper',
    name: 'FrontendDataMapper',
    description: 'A component integrating schema selection, SQL query editing, and entity data mapping for frontend data operations.',
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