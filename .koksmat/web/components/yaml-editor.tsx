'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { parse } from 'yaml'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { ComponentDoc } from './component-documentation-hub'

const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.Editor),
  { ssr: false }
)

const zodToJsonSchema = (zodSchema: z.ZodType<any>): any => {
  if (zodSchema instanceof z.ZodObject) {
    const properties: Record<string, any> = {}
    const required: string[] = []

    Object.entries(zodSchema.shape).forEach(([key, value]) => {
      properties[key] = zodToJsonSchema(value as z.ZodType<any>)
      if (!(value instanceof z.ZodOptional)) {
        required.push(key)
      }
    })

    return { type: 'object', properties, required: required.length > 0 ? required : undefined }
  } else if (zodSchema instanceof z.ZodArray) {
    return { type: 'array', items: zodToJsonSchema(zodSchema.element) }
  } else if (zodSchema instanceof z.ZodString) {
    return { type: 'string' }
  } else if (zodSchema instanceof z.ZodNumber) {
    return { type: 'number' }
  } else if (zodSchema instanceof z.ZodBoolean) {
    return { type: 'boolean' }
  } else if (zodSchema instanceof z.ZodEnum) {
    return { type: 'string', enum: zodSchema.options }
  } else if (zodSchema instanceof z.ZodOptional) {
    return zodToJsonSchema(zodSchema.unwrap())
  } else if (zodSchema instanceof z.ZodUnion) {
    return { oneOf: zodSchema.options.map((option: z.ZodType<any>) => zodToJsonSchema(option)) }
  } else {
    return {}
  }
}

interface YAMLEditorProps {
  initialData: string
  onUpdate: (data: any) => void
  editorDataSchema: z.ZodType<any>
  onStatusChange: (status: string) => void
}

export const YAMLEditor: React.FC<YAMLEditorProps> = ({ initialData, onUpdate, editorDataSchema, onStatusChange }) => {
  const [yamlContent, setYamlContent] = useState(initialData)
  const editorRef = useRef<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const loadMonacoConfig = async () => {
      if (typeof window !== 'undefined' && editorRef.current) {
        const monaco = await import('monaco-editor')
        const jsonSchema = zodToJsonSchema(editorDataSchema)

        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [{
            uri: "http://myserver/schema-for-yaml.json",
            fileMatch: ["*"],
            schema: jsonSchema
          }]
        })
      }
    }
    loadMonacoConfig()
  }, [editorDataSchema])

  const validateAndUpdate = useCallback(() => {
    try {
      const parsedData = parse(yamlContent)
      const validatedData = editorDataSchema.parse(parsedData)
      onUpdate(validatedData)
      onStatusChange('Updated successfully')

      if (editorRef.current) {
        import('monaco-editor').then((monaco) => {
          monaco.editor.setModelMarkers(editorRef.current.getModel()!, 'zod', [])
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(e => e.message).join(', ')
        onStatusChange(`Validation Error: ${errorMessage}`)

        if (editorRef.current) {
          import('monaco-editor').then((monaco) => {
            const markers = error.errors.map(err => {
              const line = typeof err.path[err.path.length - 1] === 'number'
                ? err.path[err.path.length - 1] as number + 1
                : 1
              return {
                severity: monaco.MarkerSeverity.Error,
                message: err.message,
                startLineNumber: line,
                startColumn: 1,
                endLineNumber: line,
                endColumn: 1000,
              }
            })
            monaco.editor.setModelMarkers(editorRef.current.getModel()!, 'zod', markers)
          })
        }
      } else {
        onStatusChange('Invalid YAML format')
      }
    }
  }, [yamlContent, editorDataSchema, onUpdate, onStatusChange])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setYamlContent(value)
      onStatusChange('Editing')
      validateAndUpdate()
    }
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    validateAndUpdate()
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="space-y-4">
      <Editor
        height="600px"
        language="yaml"
        value={yamlContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
        }}
        aria-labelledby="yaml-editor-label"
      />
      <div className="flex justify-between items-center">
        <Button onClick={validateAndUpdate}>Update from YAML</Button>
      </div>
    </div>
  )
}

const exampleYAMLData = `
- id: '1'
  text: Root
  icon: folder
  children:
    - id: '2'
      text: Child 1
      icon: file
      children: []
    - id: '3'
      text: Child 2
      icon: fileText
      children: []
`

type ExampleSchemaType = z.ZodArray<z.ZodObject<{
  id: z.ZodString;
  text: z.ZodString;
  icon: z.ZodEnum<["folder", "file", "fileText", "fileCode"]>;
  children: z.ZodOptional<z.ZodLazy<z.ZodTypeAny>>;
}>>

const exampleEditorDataSchema: ExampleSchemaType = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    icon: z.enum(['folder', 'file', 'fileText', 'fileCode']),
    children: z.lazy(() => exampleEditorDataSchema).optional()
  })
)

const YAMLEditorExample: React.FC = () => {
  const [status, setStatus] = useState<string>('Initializing')
  const [history, setHistory] = useState<string[]>([])

  const handleUpdate = useCallback((newData: any) => {
    console.log('Updated data:', newData)
    setHistory(prev => [...prev, `Data updated at ${new Date().toLocaleTimeString()}`])
  }, [])

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus)
    setHistory(prev => [...prev, `${newStatus} at ${new Date().toLocaleTimeString()}`])
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleStatusChange('Ready')
    }, 100)

    return () => clearTimeout(timer)
  }, [handleStatusChange])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <YAMLEditor
          initialData={exampleYAMLData}
          onUpdate={handleUpdate}
          editorDataSchema={exampleEditorDataSchema}
          onStatusChange={handleStatusChange}
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <p className="text-sm text-gray-600">{status}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
            {history.map((entry, index) => (
              <li key={index} className="text-sm">{entry}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export const examplesYAMLEditor: ComponentDoc[] = [
  {
    id: 'YAMLEditor',
    name: 'YAMLEditor',
    description: 'A component for editing YAML data using Monaco editor with inline validation and status updates. The schema is dynamically generated from a Zod schema.',
    usage: `
import React, { useState, useCallback, useEffect } from 'react'
import { YAMLEditor } from './yaml-editor'
import { z } from 'zod'
import { Card, CardContent } from '@/components/ui/card'

const yamlData = \`
- id: '1'
  text: Root
  icon: folder
  children:
    - id: '2'
      text: Child 1
      icon: file
      children: []
    - id: '3'
      text: Child 2
      icon: fileText
      children: []
\`

type MySchemaType = z.ZodArray<z.ZodObject<{
  id: z.ZodString;
  text: z.ZodString;
  icon: z.ZodEnum<["folder", "file", "fileText", "fileCode"]>;
  children: z.ZodOptional<z.ZodLazy<z.ZodTypeAny>>;
}>>

const MySchema: MySchemaType = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    icon: z.enum(['folder', 'file', 'fileText', 'fileCode']),
    children: z.lazy(() => MySchema).optional()
  })
)

const YAMLEditorExample = () => {
  const [status, setStatus] = useState<string>('Initializing')
  const [history, setHistory] = useState<string[]>([])

  const handleUpdate = useCallback((newData: any) => {
    console.log('Updated data:', newData)
    setHistory(prev => [...prev, \`Data updated at \${new Date().toLocaleTimeString()}\`])
  }, [])

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus)
    setHistory(prev => [...prev, \`\${newStatus} at \${new Date().toLocaleTimeString()}\`])
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleStatusChange('Ready')
    }, 100)

    return () => clearTimeout(timer)
  }, [handleStatusChange])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <YAMLEditor
          initialData={yamlData}
          onUpdate={handleUpdate}
          editorDataSchema={MySchema}
          onStatusChange={handleStatusChange}
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <p className="text-sm text-gray-600">{status}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">History</h3>
          <ul className="list-disc pl-5 max-h-40 overflow-y-auto">
            {history.map((entry, index) => (
              <li key={index} className="text-sm">{entry}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default YAMLEditorExample
    `,
    example: (
      <YAMLEditorExample />
    ),
  }
]
