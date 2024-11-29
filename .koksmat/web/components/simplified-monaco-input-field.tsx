'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Editor } from '@monaco-editor/react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit } from 'lucide-react'
import { ComponentDoc } from './component-documentation-hub'

/**
 * SimplifiedMonacoInputField is a versatile input component that supports both single-line and multi-line input modes.
 * It uses Monaco Editor for the multi-line mode, providing features like syntax highlighting and auto-completion.
 * The component supports real-time evaluation of JavaScript expressions based on a provided source object,
 * and correctly preserves multi-line input with comments while providing a derived single-line view.
 *
 * @component
 */
interface SimplifiedMonacoInputFieldProps {
  /** The current value of the input field */
  value: string;
  /** Callback function to handle value changes */
  onChange: (value: string) => void;
  /** Source object for providing auto-completion and expression evaluation */
  sourceItem: object;
  /** Label for the input field */
  label: string;
  /** Additional CSS classes to apply to the component */
  className?: string;
}

export default function SimplifiedMonacoInputField({
  value,
  onChange,
  sourceItem,
  label,
  className = ''
}: SimplifiedMonacoInputFieldProps) {
  const [isMultiLine, setIsMultiLine] = useState(false)
  const [multiLineValue, setMultiLineValue] = useState(value)
  const [evaluatedResult, setEvaluatedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const editorRef = useRef<any>(null)

  const singleLineValue = useMemo(() => {
    return multiLineValue.split('\n').map(line => line.split('//')[0].trim()).join(' ')
  }, [multiLineValue])

  useEffect(() => {
    evaluateExpression(multiLineValue)
  }, [multiLineValue, sourceItem])

  const evaluateExpression = (expression: string) => {
    setError(null)
    setEvaluatedResult(null)

    if (!sourceItem) {
      setError('Source item is undefined')
      return
    }

    try {
      const cleanExpression = expression.split('\n').map(line => {
        const commentIndex = line.indexOf('//')
        return commentIndex !== -1 ? line.slice(0, commentIndex).trim() : line.trim()
      }).join(' ')

      const result = new Function('item', `return ${cleanExpression}`)(sourceItem)
      setEvaluatedResult(JSON.stringify(result))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    if (!sourceItem) {
      console.warn('Source item is undefined. Auto-completion will not be available.')
      return
    }

    const itemProperties = Object.keys(sourceItem)
    const completionItems = itemProperties.map(prop => ({
      label: prop,
      kind: monaco.languages.CompletionItemKind.Property,
      insertText: prop,
      detail: `(property) ${prop}: ${typeof (sourceItem as any)[prop]}`,
    }))

    monaco.languages.registerCompletionItemProvider('javascript', {
      triggerCharacters: ['.'],
      provideCompletionItems: (model: any, position: any) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })

        if (textUntilPosition.endsWith('item.')) {
          return {
            suggestions: completionItems.map((item: any) => ({
              ...item,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column
              }
            }))
          }
        }

        return { suggestions: [] }
      },
    })
  }

  const toggleMode = () => {
    setIsMultiLine(!isMultiLine)
  }

  const handleMultiLineChange = (value: string | undefined) => {
    if (value !== undefined) {
      setMultiLineValue(value)
      onChange(value)
    }
  }

  const handleSingleLineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setMultiLineValue(newValue)
    onChange(newValue)
  }

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1" id={`${label}-label`}>{label}</label>
      <div className="relative">
        {isMultiLine ? (
          <Editor
            height="100px"
            language="javascript"
            value={multiLineValue}
            onChange={handleMultiLineChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              lineNumbers: 'off',
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              suggestOnTriggerCharacters: true,
            }}
            aria-labelledby={`${label}-label`}
          />
        ) : (
          <Input
            value={singleLineValue}
            onChange={handleSingleLineChange}
            placeholder={label}
            className="pr-10"
            aria-labelledby={`${label}-label`}
            readOnly
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={toggleMode}
          aria-label={isMultiLine ? "Switch to single-line mode" : "Switch to multi-line mode"}
        >
          {isMultiLine ? <ChevronUp className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
        {isMultiLine && (
          <div className="absolute left-0 right-0 bottom-[-1.5em] text-sm">
            {error ? (
              <span className="text-red-500 opacity-70">{error}</span>
            ) : evaluatedResult ? (
              <span className="text-green-600">Result: {evaluatedResult}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

// Example usage and documentation
const exampleItem = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
}

export const examplesSimplifiedMonacoInputField: ComponentDoc[] = [
  {
    id: 'SimplifiedMonacoInputField',
    name: 'SimplifiedMonacoInputField',
    description: 'A versatile input field component with single-line and multi-line modes, supporting real-time JavaScript expression evaluation. It preserves multi-line input with comments while providing a derived single-line view.',
    usage: `
import SimplifiedMonacoInputField from './SimplifiedMonacoInputField'
import { useState } from 'react'

const exampleItem = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
}

function MyComponent() {
  const [value, setValue] = useState('item.name // Get the name\\nitem.age // Get the age')

  return (
    <SimplifiedMonacoInputField
      value={value}
      onChange={setValue}
      sourceItem={exampleItem}
      label="Expression Input"
    />
  )
}
    `,
    example: (
      <SimplifiedMonacoInputField
        value="item.name // Get the name\nitem.age // Get the age"
        onChange={(value) => console.log(value)}
        sourceItem={exampleItem}
        label="Expression Input"
      />
    ),
  },
]
