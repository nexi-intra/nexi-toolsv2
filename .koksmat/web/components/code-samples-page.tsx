'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { ChevronDown, Copy, Menu, Link as LinkIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Highlight, themes } from 'prism-react-renderer'
import { z } from 'zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    const pluralEntity = `${lowercaseEntity}s`

    const samples: CodeSample[] = [
      {
        operation: "Fetch All",
        description: `Fetch all ${pluralEntity} using useMemo`,
        code: `'use client'

import { useMemo } from 'react'
import { ApiClient } from '@/lib/api-client'

export default function ${entityName}List() {
  const ${lowercaseEntity}Client = useMemo(() => new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN'), [])

  const { data: ${pluralEntity}, error, isLoading } = useMemo(() => ${lowercaseEntity}Client.getAll(), [${lowercaseEntity}Client])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {${pluralEntity}.map(${lowercaseEntity} => (
        <li key={${lowercaseEntity}.id}>{${lowercaseEntity}.name}</li>
      ))}
    </ul>
  )
}`
      },
      {
        operation: "Fetch One",
        description: `Fetch a specific ${lowercaseEntity} using useState`,
        code: `'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'

export default function ${entityName}Detail({ id }: { id: string }) {
  const [${lowercaseEntity}, set${entityName}] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ${lowercaseEntity}Client = new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN')
    
    const fetch${entityName} = async () => {
      try {
        const data = await ${lowercaseEntity}Client.getOne(id)
        set${entityName}(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetch${entityName}()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!${lowercaseEntity}) return <div>${entityName} not found</div>

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
        description: `Create a new ${lowercaseEntity} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/lib/api-client'

export default function Create${entityName}() {
  ${schemaFields.map(field => `const [${field.key}, set${field.key.charAt(0).toUpperCase() + field.key.slice(1)}] = useState${field.type === 'string' ? "('')" : field.type === 'number' ? '(0)' : field.type === 'boolean' ? '(false)' : '(null)'}`).join('\n  ')}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ${lowercaseEntity}Client = new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const new${entityName} = await ${lowercaseEntity}Client.create({ ${schemaFields.map(field => field.key).join(', ')} })
      console.log('Created ${lowercaseEntity}:', new${entityName})
      // Reset form or navigate away
    } catch (error) {
      console.error('Error creating ${lowercaseEntity}:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      ${schemaFields.map(field => `<input type="${field.type === 'number' ? 'number' : 'text'}" value={${field.key}} onChange={(e) => set${field.key.charAt(0).toUpperCase() + field.key.slice(1)}(${field.type === 'number' ? 'Number(e.target.value)' : 'e.target.value'})} placeholder="${field.key.charAt(0).toUpperCase() + field.key.slice(1)}" required />`).join('\n      ')}
      <button type="submit">Create ${entityName}</button>
    </form>
  )
}`
      },
      {
        operation: "Update",
        description: `Update an existing ${lowercaseEntity} using an async function`,
        code: `'use client'

import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'

interface ${entityName} {
  id: string
  ${schemaFields.map(field => `${field.key}: ${field.type}`).join('\n  ')}
}

export default function Update${entityName}({ id }: { id: string }) {
  const [${lowercaseEntity}, set${entityName}] = useState<${entityName}>({
    id: '',
    ${schemaFields.map(field => `${field.key}: ${field.type === 'string' ? "''" : field.type === 'number' ? '0' : field.type === 'boolean' ? 'false' : 'null'}`).join(',\n    ')}
  })

  useEffect(() => {
    const fetch${entityName} = async () => {
      const ${lowercaseEntity}Client = new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN')
      const data = await ${lowercaseEntity}Client.getOne(id)
      set${entityName}(data)
    }
    fetch${entityName}()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ${lowercaseEntity}Client = new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      const updated${entityName} = await ${lowercaseEntity}Client.update(id, ${lowercaseEntity})
      console.log('Updated ${lowercaseEntity}:', updated${entityName})
      // Handle successful update (e.g., show a success message)
    } catch (error) {
      console.error('Error updating ${lowercaseEntity}:', error)
      // Handle error (e.g., show an error message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      ${schemaFields.map(field => `<input
        type="${field.type === 'number' ? 'number' : 'text'}"
        value={${lowercaseEntity}.${field.key}}
        onChange={(e) => set${entityName}({ ...${lowercaseEntity}, ${field.key}: ${field.type === 'number' ? 'Number(e.target.value)' : 'e.target.value'} })}
        placeholder="${field.key.charAt(0).toUpperCase() + field.key.slice(1)}"
        required
      />`).join('\n      ')}
      <button type="submit">Update ${entityName}</button>
    </form>
  )
}`
      },
      {
        operation: "Delete",
        description: `Delete a ${lowercaseEntity} using an async function`,
        code: `'use client'

import { useState } from 'react'
import { ApiClient } from '@/lib/api-client'

export default function Delete${entityName}({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    const ${lowercaseEntity}Client = new ApiClient('${pluralEntity}', () => 'YOUR_AUTH_TOKEN')

    try {
      await ${lowercaseEntity}Client.delete(id)
      console.log('${entityName} deleted successfully')
      // Handle successful deletion (e.g., navigate away or update UI)
    } catch (err) {
      setError('Error deleting ${lowercaseEntity}: ' + (err instanceof Error ? err.message : 'An error occurred'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete ${entityName}'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}`
      }
    ]

    return samples
  }

  const samples = useMemo(() => generateSamples(), [schemaFields, entityName])

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
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{entityName} API Code Samples</h1>

      {/* Mobile ToC Dropdown */}
      <div className="lg:hidden mb-4 fixed top-14 w-max z-10 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">

              <span>Methods</span>
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
      <div className="hidden lg:block fixed top-20 right-4 w-48">
        <nav className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Methods</h2>
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
      <div className="lg:pr-44">
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
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}