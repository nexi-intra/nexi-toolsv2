'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, Copy, Search, Sun, Moon } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'

type EntityType = 'countries' | 'tools' | 'purposes' | 'tags' | 'toolGroups' | 'users'
type OperationType = 'fetch' | 'create' | 'update' | 'delete'

const entities: EntityType[] = ['countries', 'tools', 'purposes', 'tags', 'toolGroups', 'users']
const operations: OperationType[] = ['fetch', 'create', 'update', 'delete']

const codeExamples: Record<EntityType, Record<OperationType, string>> = {
  countries: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const countriesClient = new ApiClient('countries', () => 'YOUR_AUTH_TOKEN')

// Fetch all countries
const fetchCountries = async () => {
  try {
    const response = await countriesClient.getAll()
    console.log('Countries:', response.data)
  } catch (error) {
    console.error('Error fetching countries:', error)
  }
}

// Fetch a specific country
const fetchCountry = async (id: string) => {
  try {
    const country = await countriesClient.getOne(id)
    console.log('Country:', country)
  } catch (error) {
    console.error('Error fetching country:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const countriesClient = new ApiClient('countries', () => 'YOUR_AUTH_TOKEN')

const createCountry = async () => {
  const newCountry = {
    name: 'New Country',
    code: 'NC',
    continent: 'Europe',
    currency: 'EUR',
    phoneCode: '+123'
  }

  try {
    const createdCountry = await countriesClient.create(newCountry)
    console.log('Created country:', createdCountry)
  } catch (error) {
    console.error('Error creating country:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const countriesClient = new ApiClient('countries', () => 'YOUR_AUTH_TOKEN')

const updateCountry = async (id: string) => {
  const updates = {
    currency: 'USD',
    phoneCode: '+1'
  }

  try {
    const updatedCountry = await countriesClient.update(id, updates)
    console.log('Updated country:', updatedCountry)
  } catch (error) {
    console.error('Error updating country:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const countriesClient = new ApiClient('countries', () => 'YOUR_AUTH_TOKEN')

const deleteCountry = async (id: string) => {
  try {
    const result = await countriesClient.delete(id)
    console.log('Country deleted:', result)
  } catch (error) {
    console.error('Error deleting country:', error)
  }
}
`
  },
  tools: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const toolsClient = new ApiClient('tools', () => 'YOUR_AUTH_TOKEN')

// Fetch all tools
const fetchTools = async () => {
  try {
    const response = await toolsClient.getAll()
    console.log('Tools:', response.data)
  } catch (error) {
    console.error('Error fetching tools:', error)
  }
}

// Fetch a specific tool
const fetchTool = async (id: string) => {
  try {
    const tool = await toolsClient.getOne(id)
    console.log('Tool:', tool)
  } catch (error) {
    console.error('Error fetching tool:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const toolsClient = new ApiClient('tools', () => 'YOUR_AUTH_TOKEN')

const createTool = async () => {
  const newTool = {
    name: 'New Tool',
    description: 'A new tool for development',
    url: 'https://newtool.com',
    groupId: '1',
    purposeIds: ['1', '2'],
    tagIds: ['1', '3'],
    version: '1.0',
    status: 'active'
  }

  try {
    const createdTool = await toolsClient.create(newTool)
    console.log('Created tool:', createdTool)
  } catch (error) {
    console.error('Error creating tool:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const toolsClient = new ApiClient('tools', () => 'YOUR_AUTH_TOKEN')

const updateTool = async (id: string) => {
  const updates = {
    description: 'Updated tool description',
    version: '1.1',
    status: 'deprecated'
  }

  try {
    const updatedTool = await toolsClient.update(id, updates)
    console.log('Updated tool:', updatedTool)
  } catch (error) {
    console.error('Error updating tool:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const toolsClient = new ApiClient('tools', () => 'YOUR_AUTH_TOKEN')

const deleteTool = async (id: string) => {
  try {
    const result = await toolsClient.delete(id)
    console.log('Tool deleted:', result)
  } catch (error) {
    console.error('Error deleting tool:', error)
  }
}
`
  },
  purposes: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const purposesClient = new ApiClient('purposes', () => 'YOUR_AUTH_TOKEN')

// Fetch all purposes
const fetchPurposes = async () => {
  try {
    const response = await purposesClient.getAll()
    console.log('Purposes:', response.data)
  } catch (error) {
    console.error('Error fetching purposes:', error)
  }
}

// Fetch a specific purpose
const fetchPurpose = async (id: string) => {
  try {
    const purpose = await purposesClient.getOne(id)
    console.log('Purpose:', purpose)
  } catch (error) {
    console.error('Error fetching purpose:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const purposesClient = new ApiClient('purposes', () => 'YOUR_AUTH_TOKEN')

const createPurpose = async () => {
  const newPurpose = {
    name: 'New Purpose',
    description: 'A new purpose for tools',
    category: 'Development'
  }

  try {
    const createdPurpose = await purposesClient.create(newPurpose)
    console.log('Created purpose:', createdPurpose)
  } catch (error) {
    console.error('Error creating purpose:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const purposesClient = new ApiClient('purposes', () => 'YOUR_AUTH_TOKEN')

const updatePurpose = async (id: string) => {
  const updates = {
    description: 'Updated purpose description',
    category: 'Testing'
  }

  try {
    const updatedPurpose = await purposesClient.update(id, updates)
    console.log('Updated purpose:', updatedPurpose)
  } catch (error) {
    console.error('Error updating purpose:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const purposesClient = new ApiClient('purposes', () => 'YOUR_AUTH_TOKEN')

const deletePurpose = async (id: string) => {
  try {
    const result = await purposesClient.delete(id)
    console.log('Purpose deleted:', result)
  } catch (error) {
    console.error('Error deleting purpose:', error)
  }
}
`
  },
  tags: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const tagsClient = new ApiClient('tags', () => 'YOUR_AUTH_TOKEN')

// Fetch all tags
const fetchTags = async () => {
  try {
    const response = await tagsClient.getAll()
    console.log('Tags:', response.data)
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}

// Fetch a specific tag
const fetchTag = async (id: string) => {
  try {
    const tag = await tagsClient.getOne(id)
    console.log('Tag:', tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const tagsClient = new ApiClient('tags', () => 'YOUR_AUTH_TOKEN')

const createTag = async () => {
  const newTag = {
    name: 'New Tag',
    color: '#FF5733'
  }

  try {
    const createdTag = await tagsClient.create(newTag)
    console.log('Created tag:', createdTag)
  } catch (error) {
    console.error('Error creating tag:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const tagsClient = new ApiClient('tags', () => 'YOUR_AUTH_TOKEN')

const updateTag = async (id: string) => {
  const updates = {
    name: 'Updated Tag Name',
    color: '#33FF57'
  }

  try {
    const updatedTag = await tagsClient.update(id, updates)
    console.log('Updated tag:', updatedTag)
  } catch (error) {
    console.error('Error updating tag:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const tagsClient = new ApiClient('tags', () => 'YOUR_AUTH_TOKEN')

const deleteTag = async (id: string) => {
  try {
    const result = await tagsClient.delete(id)
    console.log('Tag deleted:', result)
  } catch (error) {
    console.error('Error deleting tag:', error)
  }
}
`
  },
  toolGroups: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const toolGroupsClient = new ApiClient('toolGroups', () => 'YOUR_AUTH_TOKEN')

// Fetch all tool groups
const fetchToolGroups = async () => {
  try {
    const response = await toolGroupsClient.getAll()
    console.log('Tool Groups:', response.data)
  } catch (error) {
    console.error('Error fetching tool groups:', error)
  }
}

// Fetch a specific tool group
const fetchToolGroup = async (id: string) => {
  try {
    const toolGroup = await toolGroupsClient.getOne(id)
    console.log('Tool Group:', toolGroup)
  } catch (error) {
    console.error('Error fetching tool group:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const toolGroupsClient = new ApiClient('toolGroups', () => 'YOUR_AUTH_TOKEN')

const createToolGroup = async () => {
  const newToolGroup = {
    name: 'New Tool Group',
    description: 'A new group for tools',
    parentGroupId: null
  }

  try {
    const createdToolGroup = await toolGroupsClient.create(newToolGroup)
    console.log('Created tool group:', createdToolGroup)
  } catch (error) {
    console.error('Error creating tool group:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const toolGroupsClient = new ApiClient('toolGroups', () => 'YOUR_AUTH_TOKEN')

const updateToolGroup = async (id: string) => {
  const updates = {
    description: 'Updated tool group description',
    parentGroupId: '1'
  }

  try {
    const updatedToolGroup = await toolGroupsClient.update(id, updates)
    console.log('Updated tool group:', updatedToolGroup)
  } catch (error) {
    console.error('Error updating tool group:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const toolGroupsClient = new ApiClient('toolGroups', () => 'YOUR_AUTH_TOKEN')

const deleteToolGroup = async (id: string) => {
  try {
    const result = await toolGroupsClient.delete(id)
    console.log('Tool Group deleted:', result)
  } catch (error) {
    console.error('Error deleting tool group:', error)
  }
}
`
  },
  users: {
    fetch: `
import { ApiClient } from '@/lib/api-client'

const usersClient = new ApiClient('users', () => 'YOUR_AUTH_TOKEN')

// Fetch all users
const fetchUsers = async () => {
  try {
    const response = await usersClient.getAll()
    console.log('Users:', response.data)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// Fetch a specific user
const fetchUser = async (id: string) => {
  try {
    const user = await usersClient.getOne(id)
    console.log('User:', user)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}
`,
    create: `
import { ApiClient } from '@/lib/api-client'

const usersClient = new ApiClient('users', () => 'YOUR_AUTH_TOKEN')

const createUser = async () => {
  const newUser = {
    name: 'New User',
    email: 'newuser@example.com',
    role: 'user',
    countryId: '1',
    status: 'active'
  }

  try {
    const createdUser = await usersClient.create(newUser)
    console.log('Created user:', createdUser)
  } catch (error) {
    console.error('Error creating user:', error)
  }
}
`,
    update: `
import { ApiClient } from '@/lib/api-client'

const usersClient = new ApiClient('users', () => 'YOUR_AUTH_TOKEN')

const updateUser = async (id: string) => {
  const updates = {
    role: 'admin',
    status: 'inactive'
  }

  try {
    const updatedUser = await usersClient.update(id, updates)
    console.log('Updated user:', updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}
`,
    delete: `
import { ApiClient } from '@/lib/api-client'

const usersClient = new ApiClient('users', () => 'YOUR_AUTH_TOKEN')

const deleteUser = async (id: string) => {
  try {
    const result = await usersClient.delete(id)
    console.log('User deleted:', result)
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
`
  }
}

const explanations: Record<OperationType, string> = {
  fetch: "The fetch operation allows you to retrieve data from the API. You can either fetch all items of a specific entity type or fetch a single item by its ID. This is useful for displaying lists of items or getting detailed information about a specific item.",
  create: "The create operation allows you to add new items to the database. You need to provide all the required fields for the entity you're creating. This operation is typically used when adding new records to your system.",
  update: "The update operation allows you to modify existing items in the database. You need to provide the ID of the item you want to update, along with the fields you want to change. This is useful for editing and maintaining your data.",
  delete: "The delete operation allows you to remove items from the database. You need to provide the ID of the item you want to delete. Be cautious when using this operation, as it permanently removes data from your system."
}

export function EntityCodeExamplesComponent() {
  const [activeSection, setActiveSection] = useState<string>('countries-fetch')
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for better UX

      for (const [key, ref] of Object.entries(sectionRefs.current)) {
        if (ref && ref.offsetTop <= scrollPosition && ref.offsetTop + ref.offsetHeight > scrollPosition) {
          setActiveSection(key)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
    setIsDropdownOpen(false)
  }

  const filteredEntities = entities.filter(entity =>
    entity.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You could add a toast notification here
        console.log('Copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className={`relative flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      {/* Table of Contents */}
      <div className={`md:w-1/4 ${isMobile ? 'mb-4' : 'sticky top-4 h-screen overflow-auto'}`}>
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mr-2"
          />
          <div className="flex items-center">
            <Sun className="h-4 w-4 mr-2" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Moon className="h-4 w-4 ml-2" />
          </div>
        </div>
        {isMobile ? (
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center"
            >
              Table of Contents
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border rounded-md shadow-lg">
                {filteredEntities.map((entity) => (
                  <div key={entity} className="p-2">
                    <h3 className="font-bold">{entity.charAt(0).toUpperCase() + entity.slice(1)}</h3>
                    {operations.map((operation) => (
                      <button
                        key={`${entity}-${operation}`}
                        onClick={() => scrollToSection(`${entity}-${operation}`)}
                        className={`block w-full text-left px-4 py-2 text-sm ${activeSection === `${entity}-${operation}` ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                      >
                        {operation.charAt(0).toUpperCase() + operation.slice(1)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <nav className="space-y-1">
            {filteredEntities.map((entity) => (
              <div key={entity} className="mb-4">
                <h3 className="font-bold mb-2">{entity.charAt(0).toUpperCase() + entity.slice(1)}</h3>
                {operations.map((operation) => (
                  <button
                    key={`${entity}-${operation}`}
                    onClick={() => scrollToSection(`${entity}-${operation}`)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${activeSection === `${entity}-${operation}` ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''
                      }`}
                  >
                    {operation.charAt(0).toUpperCase() + operation.slice(1)}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 space-y-8">
        {filteredEntities.map((entity) => (
          <Card key={entity} className="w-full">
            <CardHeader>
              <CardTitle>{entity.charAt(0).toUpperCase() + entity.slice(1)}</CardTitle>
              <CardDescription>Code examples for {entity} operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {operations.map((operation) => (
                <div
                  key={`${entity}-${operation}`}
                  ref={(el) => {
                    sectionRefs.current[`${entity}-${operation}`] = el
                  }}
                  className="space-y-2"
                >
                  <h3 className="text-lg font-semibold">{operation.charAt(0).toUpperCase() + operation.slice(1)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{explanations[operation]}</p>
                  <div className="relative">
                    <Button
                      onClick={() => copyToClipboard(codeExamples[entity][operation])}
                      className="absolute top-2 right-2 p-2"
                      variant="ghost"
                      size="icon"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <SyntaxHighlighter
                      language="typescript"
                      style={isDarkMode ? tomorrow : solarizedlight}
                      customStyle={{
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {codeExamples[entity][operation]}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}