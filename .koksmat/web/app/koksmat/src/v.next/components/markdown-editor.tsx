'use client'

import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { ZeroTrust } from '@/components/zero-trust'
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client"
import { ComponentDoc } from '@/components/component-documentation-hub'

// AI-friendly component description:
/**
 * MarkdownEditor: A React component for editing and parsing markdown content.
 * Features:
 * - Textarea for markdown input
 * - Real-time parsing of markdown content
 * - Hierarchical representation of parsed content (text and code blocks)
 * - Identification of potential filenames and types for code blocks
 * - Nested representation of text sections based on heading levels
 * - Support for phantom heading levels
 * - View, edit, and new modes
 * - Optional value prop for controlled component behavior
 * - Callback with validity, errors, and parsed result
 * - Customizable styling via className prop
 * - Zero Trust implementation with Zod schema validation
 */

// Zod schema for component props
const MarkdownEditorSchema = z.object({
  value: z.string().optional(),
  mode: z.enum(['view', 'edit', 'new']),
  onContentChange: z.function().args(
    z.boolean(),
    z.array(z.string()),
    z.any(),
    z.enum(['view', 'edit', 'new'])
  ).returns(z.void()),
  className: z.string().optional(),
})

// Inferred type from Zod schema
type MarkdownEditorProps = z.infer<typeof MarkdownEditorSchema>

// Types for parsed content
type CodeBlock = {
  type: 'code'
  content: string
  filename?: string
  codeType?: string
  source?: string
}

type TextSection = {
  type: 'text'
  content: string
  level: number
  isPhantom?: boolean
  children: (TextSection | CodeBlock)[]
}

type ParsedContent = (TextSection | CodeBlock)[]

const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => {
  const [content, setContent] = useState(props.value || '')
  const [parsedContent, setParsedContent] = useState<ParsedContent>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    parseMarkdown(content)
  }, [content])

  useEffect(() => {
    if (props.value !== undefined && props.value !== content) {
      setContent(props.value)
    }
  }, [props.value])

  const parseMarkdown = (markdown: string) => {
    const lines = markdown.split('\n')
    const rootSection: TextSection = { type: 'text', content: '', level: 0, children: [] }
    let currentSection: TextSection = rootSection
    let sectionStack: TextSection[] = [rootSection]
    let inCodeBlock = false
    let codeBlockContent = ''
    let codeBlockInfo = ''
    const newErrors: string[] = []

    const finalizeParsedContent = () => {
      if (codeBlockContent) {
        const [filename, codeType, source] = codeBlockInfo.split(' ')
        rootSection.children.push({
          type: 'code',
          content: codeBlockContent.trim(),
          filename,
          codeType,
          source,
        })
        codeBlockContent = ''
        codeBlockInfo = ''
      }
    }

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          finalizeParsedContent()
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeBlockInfo = line.slice(3).trim()
        }
      } else if (inCodeBlock) {
        codeBlockContent += line + '\n'
      } else {
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
        if (headingMatch) {
          const level = headingMatch[1].length
          const content = headingMatch[2]

          while (sectionStack.length > 1 && sectionStack[sectionStack.length - 1].level >= level) {
            sectionStack.pop()
          }

          currentSection = { type: 'text', content, level, children: [] }
          sectionStack[sectionStack.length - 1].children.push(currentSection)
          sectionStack.push(currentSection)
        } else {
          currentSection.content += (currentSection.content ? '\n' : '') + line
        }
      }
    })

    finalizeParsedContent()

    // Add phantom headings
    const addPhantomHeadings = (sections: (TextSection | CodeBlock)[], currentLevel = 0): (TextSection | CodeBlock)[] => {
      return sections.map(section => {
        if (section.type === 'text') {
          if (section.level > currentLevel + 1) {
            const phantomSection: TextSection = {
              type: 'text',
              content: `Phantom Heading ${currentLevel + 1}`,
              level: currentLevel + 1,
              isPhantom: true,
              children: [section]
            }
            return {
              ...phantomSection,
              children: addPhantomHeadings(phantomSection.children, phantomSection.level)
            }
          } else {
            return {
              ...section,
              children: addPhantomHeadings(section.children, section.level)
            }
          }
        }
        return section
      })
    }

    const processedContent = addPhantomHeadings(rootSection.children)
    setParsedContent(processedContent)
    setErrors(newErrors)

    // Call the onContentChange callback with the new data
    props.onContentChange(newErrors.length === 0, newErrors, processedContent, props.mode)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
  }

  const renderParsedContent = (items: ParsedContent, depth = 0) => {
    return items.map((item, index) => {
      if (item.type === 'code') {
        return (
          <div key={index} className="bg-gray-100 p-4 rounded-md my-2">
            <p className="text-sm text-gray-600 mb-2">
              {item.filename && <span className="font-bold mr-2">{item.filename}</span>}
              {item.codeType && <span className="mr-2">{item.codeType}</span>}
              {item.source && <span>Source: {item.source}</span>}
            </p>
            <pre className="whitespace-pre-wrap">{item.content}</pre>
          </div>
        )
      } else {
        return (
          <div key={index} style={{ marginLeft: `${depth * 20}px` }} className={item.isPhantom ? 'text-gray-400 italic' : ''}>
            <h2 className={`text-${7 - item.level}xl font-bold mb-2`}>{item.content.split('\n')[0]}</h2>
            {item.content.split('\n').slice(1).map((line, i) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
            {renderParsedContent(item.children, depth + 1)}
          </div>
        )
      }
    })
  }

  return (
    <div className={props.className}>
      <ZeroTrust
        schema={MarkdownEditorSchema}
        props={{ ...props }}
        actionLevel="error"
        componentName="MarkdownEditor"
      />
      {props.mode !== 'view' && (
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full h-64 p-2 border rounded-md mb-4"
          placeholder="Enter your markdown here..."
          aria-label="Markdown input"
        />
      )}
      {errors.length > 0 && (
        <div className="text-red-500 mb-4">
          <h3 className="font-bold">Errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="parsed-content">
        {renderParsedContent(parsedContent)}
      </div>
    </div>
  )
}

export default MarkdownEditor

const Example = () => {
  const [jsonResult, setJsonResult] = useState('')

  const handleContentChange = (
    valid: boolean,
    errors: string[],
    result: any,
    mode: 'view' | 'edit' | 'new'
  ) => {
    kInfo('component', 'Content changed', { valid, errors, result, mode })
    setJsonResult(JSON.stringify(result, null, 2))
  }

  return (
    <div>
      <MarkdownEditor
        value="# Welcome to MarkdownEditor

This is a sample content.

## Subsection

More content here.

```javascript example.js
console.log('Hello, world!')
```"
        mode="edit"
        onContentChange={handleContentChange}
        className="my-4"
      />
      <h3 className="text-xl font-bold mt-4">Parsed JSON Result:</h3>
      <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto">
        {jsonResult}
      </pre>
    </div>
  )
}
// Example usage documentation
export const examplesMarkdownEditor: ComponentDoc[] = [
  {
    id: 'MarkdownEditor',
    name: 'MarkdownEditor',
    description: 'A component for editing and parsing markdown content with structured representation and validation.',
    usage: `
import MarkdownEditor from './MarkdownEditor'
import { useState } from 'react'

const MyComponent = () => {
  const [jsonResult, setJsonResult] = useState('')

  const handleContentChange = (
    valid: boolean,
    errors: string[],
    result: any,
    mode: 'view' | 'edit' | 'new'
  ) => {
    console.log('Content changed:', { valid, errors, result, mode })
    setJsonResult(JSON.stringify(result, null, 2))
  }

  return (
    <div>
      <MarkdownEditor
        value="# Welcome to MarkdownEditor

This is a sample content.

## Subsection

More content here.

\`\`\`javascript example.js
console.log('Hello, world!')
\`\`\`"
        mode="edit"
        onContentChange={handleContentChange}
        className="my-4"
      />
      <h3 className="text-xl font-bold mt-4">Parsed JSON Result:</h3>
      <pre className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto">
        {jsonResult}
      </pre>
    </div>
  )
}
`,
    example: (() => {

      return (
        <Example />
      )
    })(),
  },
]