'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { ChevronDown, Copy, Menu, Link as LinkIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Highlight, themes } from 'prism-react-renderer'
import { z } from 'zod'
import path from 'path'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateFileDialogComponent } from './app-components-create-file-dialog'
import { typeNames } from '@/app/tools/schemas/forms'


interface CodeSample {
  operation: string
  description: string
  code: string
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <Highlight theme={themes.nightOwl} code={code} language="tsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre className={`${className} p-4 rounded-md overflow-x-auto`} style={style}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line, key: i })}>
            <span className="mr-4 text-gray-500">{i + 1}</span>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
)

interface DynamicEntityCodeSamplesProps {
  schema?: z.ZodObject<any>
  entityName: string
}

export default function DynamicEntityCodeSamples({ schema, entityName }: DynamicEntityCodeSamplesProps) {
  const [activeSection, setActiveSection] = useState('')
  const fieldsToOmit = ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy']

  const typeName = typeNames[entityName as keyof typeof typeNames] || entityName

  const schemaFields = useMemo(() => {
    if (!schema || typeof schema.shape !== 'object') {
      console.error('Invalid schema provided to DynamicEntityCodeSamples')
      return []
    }

    return Object.entries(schema.shape)
      .filter(([key]) => !fieldsToOmit.includes(key))
      .map(([key, value]) => {
        let type = 'string'
        if (value instanceof z.ZodNumber) type = 'number'
        if (value instanceof z.ZodBoolean) type = 'boolean'
        if (value instanceof z.ZodDate) type = 'Date'
        return { key, type }
      })
  }, [schema])

  const generateSamples = (): CodeSample[] => {
    if (schemaFields.length === 0) {
      return [{
        operation: "Error",
        description: "Unable to generate code samples due to invalid schema",
        code: "// Error: Invalid schema provided"
      }]
    }

    const lowercaseEntity = entityName.toLowerCase()

    const samples: CodeSample[] = [
      {
        operation: "Fetch All",
        description: `Fetch all ${typeName} with pagination using useEffect and useState`,
        code: `'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function ${typeName}List() {
  const [${lowercaseEntity}s, set${typeName}s] = useState<${typeName}[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    const fetch${typeName}s = async () => {
      try {
        const data = await ${lowercaseEntity}Client.getAll(page, pageSize)
        set${typeName}s(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetch${typeName}s()
  }, [page, pageSize])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <ul>
        {${lowercaseEntity}s.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div>
        Total: {totalCount} | Page: {page} of {Math.ceil(totalCount / pageSize)}
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(totalCount / pageSize)}>Next</button>
      </div>
    </div>
  )
}`
      },
      {
        operation: "Fetch One",
        description: `Fetch a specific ${typeName} using useState`,
        code: `'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function ${typeName}Detail() {
  // TODO: Replace '2' with the actual ID you want to fetch
  const id = '2'
  const [${lowercaseEntity}, set${typeName}] = useState<${typeName} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')
    
    const fetch${typeName} = async () => {
      try {
        const data = await ${lowercaseEntity}Client.getOne(id)
        set${typeName}(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetch${typeName}()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!${lowercaseEntity}) return <div>${typeName} not found</div>

  return (
    <div>
      <h1>{${lowercaseEntity}.name}</h1>
      ${schemaFields.map(field => `<p>${field.key}: {${lowercaseEntity}.${field.key}}</p>`).join('\n      ')}
    </div>
  )
}`
      },
      {
        operation: "Create",
        description: `Create a new ${typeName} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function Create${typeName}() {
  ${schemaFields.map(field => `const [${field.key}, set${field.key.charAt(0).toUpperCase() + field.key.slice(1)}] = useState${field.type === 'string' ? "<string>('')" : field.type === 'number' ? '<number>(0)' : field.type === 'boolean' ? '<boolean>(false)' : '<Date | null>(null)'}`).join('\n  ')}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const new${typeName} = await ${lowercaseEntity}Client.create({ ${schemaFields.map(field => field.key).join(', ')} })
      console.log('Created ${typeName}:', new${typeName})
      // Reset form or navigate away
    } catch (error) {
      console.error('Error creating ${typeName}:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      ${schemaFields.map(field => `<input type="${field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}" value={${field.key}${field.type === 'Date' ? ' ? ' + field.key + '.toISOString().split(\'T\')[0] : \'\'' : ''}} onChange={(e) => set${field.key.charAt(0).toUpperCase() + field.key.slice(1)}(${field.type === 'number' ? 'Number(e.target.value)' : field.type === 'Date' ? 'new Date(e.target.value)' : 'e.target.value'})} placeholder="${field.key.charAt(0).toUpperCase() + field.key.slice(1)}" required />`).join('\n      ')}
      <button type="submit">Create ${typeName}</button>
    </form>
  )
}`
      },
      {
        operation: "Update",
        description: `Update an existing ${typeName} using an async function`,
        code: `'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function Update${typeName}() {
  // TODO: Replace '2' with the actual ID you want to update
  const id = '2'
  const [${lowercaseEntity}, set${typeName}] = useState<${typeName} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch${typeName} = async () => {
      const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')
      try {
        const data = await ${lowercaseEntity}Client.getOne(id)
        set${typeName}(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setIsLoading(false)
      }
    }
    fetch${typeName}()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!${lowercaseEntity}) return

    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const updated${typeName} = await ${lowercaseEntity}Client.update(id, ${lowercaseEntity})
      console.log('Updated ${typeName}:', updated${typeName})
      // Handle successful update (e.g., show a success message)
    } catch (error) {
      console.error('Error updating ${typeName}:', error)
      // Handle error (e.g., show an error message)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!${lowercaseEntity}) return <div>${typeName} not found</div>

  return (
    <form onSubmit={handleSubmit}>
      ${schemaFields.map(field => `<input
        type="${field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}"
        value={${lowercaseEntity}.${field.key}${field.type === 'Date' ? ' ? ' + lowercaseEntity + '.' + field.key + '.toISOString().split(\'T\')[0] : \'\'' : ''}}
        onChange={(e) => set${typeName}({ ...${lowercaseEntity}, ${field.key}: ${field.type === 'number' ? 'Number(e.target.value)' : field.type === 'Date' ? 'new Date(e.target.value)' : 'e.target.value'} })}
        placeholder="${field.key.charAt(0).toUpperCase() + field.key.slice(1)}"
        required
      />`).join('\n      ')}
      <button type="submit">Update ${typeName}</button>
    </form>
  )
}`
      },
      {
        operation: "Patch",
        description: `Partially update an existing ${typeName} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function Patch${typeName}() {
  // TODO: Replace '2' with the actual ID you want to patch
  const id = '2'
  const [patchData, setPatchData] = useState<Partial<${typeName}>>({})
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const patched${typeName} = await ${lowercaseEntity}Client.patch(id, patchData)
      console.log('Patched ${typeName}:', patched${typeName})
      // Handle successful patch (e.g., show a success message)
    } catch (error) {
      console.error('Error patching ${typeName}:', error)
      setError('Failed to patch ${typeName}')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      ${schemaFields.map(field => `<input
        type="${field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}"
        onChange={(e) => setPatchData({ ...patchData, ${field.key}: ${field.type === 'number' ? 'Number(e.target.value)' : field.type === 'Date' ? 'new Date(e.target.value)' : 'e.target.value'} })}
        placeholder="${field.key.charAt(0).toUpperCase() + field.key.slice(1)}"
      />`).join('\n      ')}
      <button type="submit">Patch ${typeName}</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}`

      },
      {
        operation: "Delete",
        description: `Delete a ${typeName} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function Delete${typeName}() {
  // TODO: Replace '2' with the actual ID you want to delete
  const id = '2'
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const result = await ${lowercaseEntity}Client.delete(id)
      if (result) {
        console.log('${typeName} deleted successfully')
        // Handle successful deletion (e.g., navigate away or update UI)
      } else {
        setError('Failed to delete ${typeName}')
      }
    } catch (err) {
      setError('Error deleting ${typeName}: ' + (err instanceof Error ? err.message : 'An error occurred'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete ${typeName}'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}`
      },
      {
        operation: "Query",
        description: `Execute a custom SQL query for ${typeName} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/app/tools/api/entity/api-client'
import { ${typeName} } from '@/app/tools/api/entity/schemas'

export default function Query${typeName}() {
  const [sql, setSql] = useState<string>('')
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const ${lowercaseEntity}Client = new ApiClient('${lowercaseEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const data = await ${lowercaseEntity}Client.query(sql, 1, 100, (row) => row)
      setResults(data.items)
    } catch (err) {
      setError('Error executing query: ' + (err instanceof Error ? err.message : 'An error occurred'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Enter your SQL query here"
          rows={4}
          cols={50}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Executing...' : 'Execute Query'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(results[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value: any, i) => (
                  <td key={i}>{JSON.stringify(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}`
      }
    ]

    return samples
  }

  const samples = useMemo(() => generateSamples(), [schemaFields, entityName, typeName])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code copied",
        description: "The code sample has been copied to your clipboard.",
      })
    }).catch((err) => {
      console.error('Failed to copy: ', err)
      toast({
        title: "Failed to copy",
        description: "An error occurred while copying the code.",
        variant: "destructive",
      })
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section')
      let currentActiveSection = ''

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.pageYOffset >= sectionTop - 150 && window.pageYOffset < sectionTop + sectionHeight - 150) {
          currentActiveSection = section.id
        }
      })

      setActiveSection(currentActiveSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const yOffset = -100
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (schemaFields.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Error: Invalid Schema</h1>
        <p className="text-red-500">Unable to generate code samples due to an invalid or missing schema.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{typeName} API Code Samples</h1>

      {/* Mobile ToC Dropdown */}
      <div className="md:hidden mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Menu className="mr-2 h-4 w-4" />
              <span>Table of Contents</span>
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
            {samples.map((sample, index) => (
              <DropdownMenuItem key={index} onSelect={() => scrollToSection(`section-${index}`)}>
                {sample.operation}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop ToC */}
      <div className="hidden md:block fixed top-20 right-4 w-48">
        <nav className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Table of Contents</h2>
          <ul>
            {samples.map((sample, index) => (
              <li key={index} className="mb-2">
                <a
                  href={`#section-${index}`}
                  className={`text-sm ${activeSection === `section-${index}` ? 'text-blue-500 font-semibold' : 'text-gray-600 dark:text-gray-300'} hover:text-blue-500 dark:hover:text-blue-400`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(`section-${index}`)
                  }}
                >
                  {sample.operation}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="md:pr-52">
        {samples.map((sample, index) => (
          <section key={index} id={`section-${index}`} className="mb-12 pt-24 -mt-24">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4 dark:text-white group flex items-center">
                {sample.operation}
                <a href={`#section-${index}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <LinkIcon className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                </a>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{sample.description}</p>
              <div className="relative">
                <CodeBlock code={sample.code} />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(sample.code)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
                <div className="absolute top-2 right-20">
                  <CreateFileDialogComponent
                    content={sample.code}
                    path={path.join("test", entityName.toLowerCase(), sample.operation.replaceAll(" ", "-").toLowerCase())} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}