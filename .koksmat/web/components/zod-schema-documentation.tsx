"use client"

import React, { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { ComponentDoc } from './component-documentation-hub'
import * as z from 'zod'
import { Copy, Check, Bot } from 'lucide-react'

interface ZodSchemaDocumentationProps {
  schema: z.ZodType<any>
  name: string
  typename: string
  className?: string
}

/**
 * ZodSchemaDocumentation Component
 * 
 * This component displays Zod schema definitions with syntax highlighting and copy buttons.
 * It provides a clean and simple way to showcase type information using Zod schemas.
 * 
 * @param schema - The Zod schema to display
 * @param name - Optional name for the schema (used in the display)
 * @param typename - Optional typename for displaying the import statement
 * @param className - Additional CSS classes to apply to the component
 */
export default function ZodSchemaDocumentation({
  schema,
  name,
  typename,
  className = ''
}: ZodSchemaDocumentationProps) {
  const [copied, setCopied] = useState(false)
  const [aiPromptCopied, setAiPromptCopied] = useState(false)
  const schemaString = zodToTs(schema, name)
  const fullSchemaString = typename
    ? `import { ${typename} } from '@/app/tools/api/entity/schemas'\n\n${schemaString}`
    : schemaString

  const aiPromptString = `To use this type in your code, follow these steps:

1. Import the type:
   import { ${typename || name} } from '@/app/tools/api/entity/schemas'

2. Use the type in your code:
   const myVariable: ${typename || name} = {
     // ... your object properties here
   }

Type definition:
${schemaString}`

  const copyToClipboard = (text: string, setCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState(true)
      setTimeout(() => setCopiedState(false), 2000)
    })
  }

  return (
    <div className={`relative p-4 border rounded-lg ${className}`}>
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={() => copyToClipboard(fullSchemaString, setCopied)}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Copy schema to clipboard"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => copyToClipboard(aiPromptString, setAiPromptCopied)}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Copy AI prompt to clipboard"
        >
          {aiPromptCopied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </button>
      </div>
      <Highlight theme={themes.github} code={fullSchemaString} language="typescript">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 rounded overflow-auto`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

// Helper function to convert Zod schema to TypeScript representation
function zodToTs(schema: z.ZodType<any>, name?: string): string {
  let result = ''
  if (name) {
    result += `type ${name} = `
  }

  if (schema instanceof z.ZodObject) {
    result += '{\n'
    Object.entries(schema.shape).forEach(([key, value]) => {
      result += `  ${key}: ${zodToTs(value as z.ZodType<any>)};\n`
    })
    result += '}'
  } else if (schema instanceof z.ZodArray) {
    result += `${zodToTs(schema.element)}[]`
  } else if (schema instanceof z.ZodString) {
    result += 'string'
  } else if (schema instanceof z.ZodNumber) {
    result += 'number'
  } else if (schema instanceof z.ZodBoolean) {
    result += 'boolean'
  } else if (schema instanceof z.ZodEnum) {
    result += schema.options.map((o: string | number | boolean) => `"${o}"`).join(' | ')
  } else if (schema instanceof z.ZodUnion) {
    result += schema._def.options.map((o: z.ZodType<any>) => zodToTs(o)).join(' | ')
  } else if (schema instanceof z.ZodOptional) {
    result += `${zodToTs(schema.unwrap())} | undefined`
  } else {
    result += 'unknown'
  }

  return result
}

// Example usage documentation
export const examplesZodSchemaDocumentation: ComponentDoc[] = [
  {
    id: 'ZodSchemaDocumentation-Simple',
    name: 'ZodSchemaDocumentation - Simple Schema',
    description: 'Displays a simple Zod schema with syntax highlighting, copy buttons for schema and AI prompt.',
    usage: `
import * as z from 'zod'

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
})

<ZodSchemaDocumentation schema={UserSchema} name="User" typename="UserSchema" />
    `,
    example: (
      <ZodSchemaDocumentation
        schema={z.object({
          id: z.number(),
          name: z.string(),
          email: z.string().email(),
          age: z.number().optional(),
        })}
        name="User"
        typename="UserSchema"
      />
    ),
  },
  {
    id: 'ZodSchemaDocumentation-Complex',
    name: 'ZodSchemaDocumentation - Complex Schema',
    description: 'Displays a more complex Zod schema with syntax highlighting, copy buttons for schema and AI prompt.',
    usage: `
import * as z from 'zod'

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
  }),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published', 'archived']),
  createdAt: z.date(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])),
})

<ZodSchemaDocumentation schema={PostSchema} name="Post" typename="PostSchema" />
    `,
    example: (
      <ZodSchemaDocumentation
        schema={z.object({
          id: z.number(),
          title: z.string(),
          content: z.string(),
          author: z.object({
            id: z.number(),
            name: z.string(),
          }),
          tags: z.array(z.string()),
          status: z.enum(['draft', 'published', 'archived']),
          createdAt: z.date(),
          metadata: z.record(z.union([z.string(), z.number(), z.boolean()])),
        })}
        name="Post"
        typename="PostSchema"
      />
    ),
  },
]