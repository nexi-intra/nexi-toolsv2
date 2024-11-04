"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { z } from 'zod'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ZeroTrust } from '@/components/zero-trust'
import { EntityDataMapping } from './data-mapper'

// Define the schemas and sample data
const targetSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  emailAddress: z.string().email(),
  isActiveUser: z.boolean()
})

const sourceSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  birth_date: z.string(),
  email: z.string().email(),
  is_active: z.boolean()
})

const sampleItem = {
  id: 1,
  first_name: "John",
  last_name: "Doe",
  birth_date: "1990-01-01",
  email: "john.doe@example.com",
  is_active: true
}

const initialMapping: any = {
  fullName: "item.first_name + ' ' + item.last_name",
  age: "new Date().getFullYear() - new Date(item.birth_date).getFullYear()",
  emailAddress: "item.email",
  isActiveUser: "item.is_active"
}

// Define the props schema for this component
const ZodMappingDemoSchema = z.object({
  className: z.string().optional()
})

type ZodMappingDemoProps = z.infer<typeof ZodMappingDemoSchema>

export function ZodMappingDemoComponent({ className = '' }: ZodMappingDemoProps) {
  const [mapping, setMapping] = useState(initialMapping)
  const [parsedObject, setParsedObject] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Memoize the dynamic Zod object to avoid unnecessary re-creation
  const dynamicZodObject = useMemo(() => {
    return z.object(
      Object.entries(mapping).reduce((acc, [key, value]) => {
        try {
          // Use Function constructor to create a function from the mapping string
          const mappingFunction = new Function('item', `return ${value}`)
          const result = mappingFunction(sampleItem)

          // Infer the Zod type based on the result
          if (typeof result === 'string') {
            acc[key] = z.string()
          } else if (typeof result === 'number') {
            acc[key] = z.number()
          } else if (typeof result === 'boolean') {
            acc[key] = z.boolean()
          } else {
            acc[key] = z.any()
          }
        } catch (error) {
          console.error(`Error in mapping for ${key}:`, error)
          acc[key] = z.any()
        }
        return acc
      }, {} as Record<string, z.ZodTypeAny>)
    )
  }, [mapping])

  const handleChange = useCallback(({ mapping }: { mapping: any }) => {
    setMapping(mapping)
    try {
      const parsedData = dynamicZodObject.parse(
        Object.entries(mapping).reduce((acc, [key, value]) => {
          try {
            const mappingFunction = new Function('item', `return ${value}`)
            acc[key] = mappingFunction(sampleItem)
          } catch (error) {
            console.error(`Error in mapping for ${key}:`, error)
            acc[key] = null
          }
          return acc
        }, {} as Record<string, any>)
      )
      setParsedObject(parsedData)
      setError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map(e => e.message).join(', '))
      } else {
        setError('An unexpected error occurred')
      }
      setParsedObject(null)
    }
  }, [dynamicZodObject])

  const zodSchemaCode = useMemo(() => {
    const schemaEntries = Object.entries(targetSchema.shape).map(([key, value]) => {
      const originalType = value._def.typeName
      const mappingLogic = mapping[key]
      return `  ${key}: z.${originalType}().transform(item => ${mappingLogic})`
    })

    return `import { z } from 'zod';

const transformationSchema = z.object({
${schemaEntries.join(',\n')}
});`
  }, [mapping, targetSchema])

  const handleCopy = () => {
    navigator.clipboard.writeText(zodSchemaCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <ZeroTrust
        schema={ZodMappingDemoSchema}
        props={{ className }}
        actionLevel="error"
        componentName="ZodMappingDemo"
      />
      <div className={`space-y-4 ${className}`}>
        <EntityDataMapping
          targetSchema={targetSchema}

          sampleItem={sampleItem}
          initialMapping={initialMapping}
          onChange={handleChange}
          className="border p-4 rounded"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Transformation Zod Schema:</h3>
          <div className="relative">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                borderRadius: '0.375rem',
                padding: '1rem',
              }}
            >
              {zodSchemaCode}
            </SyntaxHighlighter>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy code"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {parsedObject && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Parsed Object:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(parsedObject, null, 2)}
            </pre>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <h3 className="text-lg font-semibold">Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  )
}

// Example usage documentation
import { ComponentDoc } from './component-documentation-hub'

export const examplesZodMappingDemo: ComponentDoc[] = [
  {
    id: 'ZodMappingDemo',
    name: 'ZodMappingDemo',
    description: 'A component that demonstrates dynamic Zod object creation with transformation logic based on EntityDataMapping.',
    usage: `
<ZodMappingDemo className="custom-class" />
    `,
    example: (
      <ZodMappingDemoComponent className="max-w-3xl mx-auto" />
    ),
  }
]