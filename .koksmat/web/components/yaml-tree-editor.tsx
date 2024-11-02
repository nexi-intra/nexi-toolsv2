'use client'

import React, { useState, useCallback } from 'react'
import { TreeEditor } from './tree-editor' // Assuming this is the correct import
import { nanoid } from 'nanoid'
import yaml from 'js-yaml'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, FileUp, Download } from 'lucide-react'
import { ComponentDoc } from './component-documentation-hub'

// Define the EditorData type based on the example provided
import { TreeNode } from './tree-editor-components'

type EditorData = Array<TreeNode>

// Define the ActionType based on the example provided
type ActionType = {
  id: string
  title: string
  description: string
  actionType: string
  properties: Record<string, unknown>
}

interface YamlTreeEditorProps {
  initialData: EditorData
  actions: ActionType[]
  className?: string
}

const YamlTreeEditor: React.FC<YamlTreeEditorProps> = ({ initialData, actions, className = '' }) => {
  const [data, setData] = useState<EditorData>(initialData)
  const [yamlInput, setYamlInput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((newData: EditorData) => {
    setData(newData)
    console.log('Structure updated:', newData)
  }, [])

  const downloadYaml = useCallback(() => {
    const yamlString = yaml.dump(data)
    const blob = new Blob([yamlString], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tree-structure.yaml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data])

  const validateAndSetData = useCallback((yamlString: string) => {
    try {
      const parsedData = yaml.load(yamlString) as EditorData
      // Basic validation: check if the parsed data is an array and has the expected structure
      if (!Array.isArray(parsedData) || !parsedData.every(item => 'id' in item && 'text' in item && 'icon' in item && 'children' in item)) {
        throw new Error('Invalid YAML structure')
      }
      setData(parsedData)
      setError(null)
      setYamlInput('')
    } catch (e) {
      setError('Invalid YAML: ' + (e instanceof Error ? e.message : String(e)))
    }
  }, [])

  const handleYamlInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYamlInput(e.target.value)
  }, [])

  const handleYamlPaste = useCallback(() => {
    validateAndSetData(yamlInput)
  }, [yamlInput, validateAndSetData])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result
        if (typeof content === 'string') {
          validateAndSetData(content)
        }
      }
      reader.readAsText(file)
    }
  }, [validateAndSetData])

  return (
    <div className={`space-y-4 ${className}`}>
      <TreeEditor
        initialData={data}
        onChange={handleChange}
        actions={actions}
      />
      <div className="flex space-x-2">
        <Button onClick={downloadYaml}>
          <Download className="mr-2 h-4 w-4" />
          Download YAML
        </Button>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button >
            <FileUp className="mr-2 h-4 w-4" />
            Upload YAML
          </Button>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <Textarea
        placeholder="Paste YAML here..."
        value={yamlInput}
        onChange={handleYamlInput}
      />
      <Button onClick={handleYamlPaste}>Parse YAML</Button>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Example data and actions
const exampleData: EditorData = [
  {
    id: nanoid(),
    text: 'Our Group',
    icon: 'Folder',
    children: [
      {
        id: nanoid(),
        text: 'About us',
        icon: 'File',
        children: [
          {
            id: nanoid(),
            text: 'Strategic positioning, ambition & purpose',
            icon: 'FileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Facts & Figures',
            icon: 'FileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Values & Behaviours',
            icon: 'FileText',
            children: []
          }
        ]
      },
      {
        id: nanoid(),
        text: 'New@Nexi: Onboarding Guides',
        icon: 'File',
        children: []
      }
    ]
  },
  // ... (rest of the example data)
]

const exampleActions: ActionType[] = [
  {
    id: 'action1',
    title: 'Action 1',
    description: 'This is action 1',
    actionType: 'type1',
    properties: {},
  },
  {
    id: 'action2',
    title: 'Action 2',
    description: 'This is action 2',
    actionType: 'type2',
    properties: {},
  }
]

// Export examples using ComponentDoc
export const examplesYamlTreeEditor: ComponentDoc[] = [
  {
    id: 'YamlTreeEditor',
    name: 'YamlTreeEditor',
    description: 'A component for editing tree structures with YAML import/export functionality.',
    usage: `
import { YamlTreeEditor } from './yaml-tree-editor'
import { nanoid } from 'nanoid'

const exampleData = [
  {
    id: nanoid(),
    text: 'Root',
    icon: 'Folder',
    children: [
      {
        id: nanoid(),
        text: 'Child',
        icon: 'File',
        children: []
      }
    ]
  }
]

const exampleActions = [
  {
    id: 'action1',
    title: 'Action 1',
    description: 'This is action 1',
    actionType: 'type1',
    properties: {},
  }
]

<YamlTreeEditor
  initialData={exampleData}
  actions={exampleActions}
/>
`,
    example: (
      <YamlTreeEditor
        initialData={exampleData}
        actions={exampleActions}
      />
    ),
  }
]

export default YamlTreeEditor