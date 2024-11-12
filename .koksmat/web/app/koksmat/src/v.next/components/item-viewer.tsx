'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, Calendar, Columns, ChevronLeft, ChevronRight, X, Edit, Copy, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ZeroTrust } from '@/components/zero-trust'
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client"
import { z } from 'zod'
import { ComponentDoc } from '@/components/component-documentation-hub'
import TokenInput from '@/components/token-input'
import { PropertySchema } from '@/components/token-input-internal'
import { FaCircle, FaSquare, FaStar } from 'react-icons/fa'
import { useSearchParams, useRouter } from 'next/navigation'

// Schema for countries
const CountrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  continent: z.string().min(1),
  population: z.number().int().positive(),
  capital: z.string().min(1),
  constitutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
})

type Country = z.infer<typeof CountrySchema>

// Schema for arrays of countries
const CountriesArraySchema = z.array(CountrySchema)

// Sample data
const countries: Country[] = [
  { id: 1, name: 'United States', continent: 'North America', population: 331002651, capital: 'Washington, D.C.', constitutionDate: '1787-09-17' },
  { id: 2, name: 'China', continent: 'Asia', population: 1439323776, capital: 'Beijing', constitutionDate: '1982-12-04' },
  { id: 3, name: 'India', continent: 'Asia', population: 1380004385, capital: 'New Delhi', constitutionDate: '1950-01-26' },
  { id: 4, name: 'Brazil', continent: 'South America', population: 212559417, capital: 'Brasília', constitutionDate: '1988-10-05' },
  { id: 5, name: 'Russia', continent: 'Europe/Asia', population: 145934462, capital: 'Moscow', constitutionDate: '1993-12-25' },
  { id: 6, name: 'Japan', continent: 'Asia', population: 126476461, capital: 'Tokyo', constitutionDate: '1947-05-03' },
  { id: 7, name: 'Germany', continent: 'Europe', population: 83783942, capital: 'Berlin', constitutionDate: '1949-05-23' },
  { id: 8, name: 'United Kingdom', continent: 'Europe', population: 67886011, capital: 'London', constitutionDate: '1215-06-15' },
  { id: 9, name: 'France', continent: 'Europe', population: 65273511, capital: 'Paris', constitutionDate: '1958-10-04' },
  { id: 10, name: 'Italy', continent: 'Europe', population: 60461826, capital: 'Rome', constitutionDate: '1948-01-01' },
  { id: 11, name: 'South Africa', continent: 'Africa', population: 59308690, capital: 'Pretoria, Cape Town, Bloemfontein', constitutionDate: '1996-12-10' },
  { id: 12, name: 'South Korea', continent: 'Asia', population: 51269185, capital: 'Seoul', constitutionDate: '1948-07-17' },
  { id: 13, name: 'Colombia', continent: 'South America', population: 50882891, capital: 'Bogotá', constitutionDate: '1991-07-04' },
  { id: 14, name: 'Spain', continent: 'Europe', population: 46754778, capital: 'Madrid', constitutionDate: '1978-12-29' },
  { id: 15, name: 'Argentina', continent: 'South America', population: 45195774, capital: 'Buenos Aires', constitutionDate: '1853-05-01' },
]

// Validate the sample data
CountriesArraySchema.parse(countries)

// Mock components for different view types
const CardView = ({ items, onItemClick }: { items: Country[], onItemClick: (id: number) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item) => (
      <div key={item.id} className="p-4 border rounded-md">
        <h3 className="font-bold">
          <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item.id); }} className="text-blue-600 hover:underline">
            {item.name}
          </a>
        </h3>
        <p>Capital: {item.capital}</p>
        <p>Population: {item.population.toLocaleString()}</p>
        <p>Continent: {item.continent}</p>
      </div>
    ))}
  </div>
)

const TableView = ({ items, onItemClick }: { items: Country[], onItemClick: (id: number) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Capital</th>
          <th className="border p-2">Population</th>
          <th className="border p-2">Continent</th>
          <th className="border p-2">Constitution Date</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="border p-2">
              <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item.id); }} className="text-blue-600 hover:underline">
                {item.name}
              </a>
            </td>
            <td className="border p-2">{item.capital}</td>
            <td className="border p-2">{item.population.toLocaleString()}</td>
            <td className="border p-2">{item.continent}</td>
            <td className="border p-2">{item.constitutionDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const ListView = ({ items, onItemClick }: { items: Country[], onItemClick: (id: number) => void }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item.id} className="p-2 border rounded-md">
        <h3 className="font-bold">
          <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item.id); }} className="text-blue-600 hover:underline">
            {item.name}
          </a>
        </h3>
        <p>Capital: {item.capital}</p>
        <p>Population: {item.population.toLocaleString()}</p>
        <p>Continent: {item.continent}</p>
        <p>Constitution Date: {item.constitutionDate}</p>
      </li>
    ))}
  </ul>
)

const CalendarView = ({ items, onItemClick }: { items: Country[], onItemClick: (id: number) => void }) => (
  <div className="grid grid-cols-7 gap-2">
    {Array.from({ length: 31 }, (_, i) => {
      const matchingCountry = items.find(item => {
        const date = new Date(item.constitutionDate)
        return date.getDate() === i + 1
      })
      return (
        <div key={i} className="p-2 border rounded-md text-center">
          <div className="font-bold">{i + 1}</div>
          {matchingCountry && (
            <div className="text-xs">
              <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(matchingCountry.id); }} className="text-blue-600 hover:underline">
                {matchingCountry.name}
              </a>
            </div>
          )}
        </div>
      )
    })}
  </div>
)

const KanbanView = ({ items, onItemClick }: { items: Country[], onItemClick: (id: number) => void }) => {
  const continents = Array.from(new Set(items.map(item => item.continent)))
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {continents.map((continent) => (
        <div key={continent} className="flex-shrink-0 w-64 p-4 border rounded-md">
          <h3 className="font-bold mb-2">{continent}</h3>
          <div className="space-y-2">
            {items.filter((item) => item.continent === continent).map((item) => (
              <div key={item.id} className="p-2 bg-gray-100 rounded-md">
                <div className="font-semibold">
                  <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item.id); }} className="text-blue-600 hover:underline">
                    {item.name}
                  </a>
                </div>
                <div className="text-sm">Capital: {item.capital}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

type ViewMode = 'card' | 'table' | 'list' | 'calendar' | 'kanban'

const ItemViewerSchema = z.object({
  items: CountriesArraySchema,
  onSearch: z.function().optional(),
  properties: z.array(PropertySchema).optional(),
  options: z.object({
    pageSize: z.number().optional(),
    heightBehaviour: z.enum(['Dynamic', 'Full']).default('Full')
  }).optional()
})

type ItemViewerProps = z.infer<typeof ItemViewerSchema>

/**
 * ItemViewerComponent - A versatile component for displaying country data in various view modes
 * 
 * This component provides multiple view options (card, table, list, calendar, kanban)
 * for displaying a collection of country items. It includes features such as pagination,
 * search functionality, and smooth transitions between view modes.
 * 
 * @component
 * @param {ItemViewerProps} props - The properties passed to the component
 * @param {Country[]} props.items - The array of country items to be displayed
 * @param {function} [props.onSearch] - Optional callback function for search functionality
 * @param {object} [props.options] - Optional configuration object
 * @param {number} [props.options.pageSize=10] - Number of items to display per page
 */
export function ItemViewerComponent({ items = [], onSearch, properties, options = { heightBehaviour: 'Full' } }: ItemViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showInfinityLoader, setShowInfinityLoader] = useState(false)
  const [filteredItems, setFilteredItems] = useState(items)

  const searchParams = useSearchParams()
  const router = useRouter()

  const pageSize = options.pageSize || 10
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const heightBehaviour = options.heightBehaviour || 'Full'

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [viewMode, currentPage])

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowInfinityLoader(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setShowInfinityLoader(false)
    }
  }, [isLoading])

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.capital.toLowerCase().includes(lowercaseQuery) ||
      item.continent.toLowerCase().includes(lowercaseQuery)
    )
    setFilteredItems(filtered)
    setCurrentPage(1)
    if (onSearch) {
      onSearch(query)
    }
  }

  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleItemClick = (id: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('pane', 'details')
    params.set('id', id.toString())
    router.push(`?${params.toString()}`)
  }

  const handleClosePane = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('pane')
    params.delete('id')
    router.push(`?${params.toString()}`)
  }

  const renderView = () => {
    switch (viewMode) {
      case 'card':
        return <CardView items={paginatedItems} onItemClick={handleItemClick} />
      case 'table':
        return <TableView items={paginatedItems} onItemClick={handleItemClick} />
      case 'list':
        return <ListView items={paginatedItems} onItemClick={handleItemClick} />
      case 'calendar':
        return <CalendarView items={paginatedItems} onItemClick={handleItemClick} />
      case 'kanban':
        return <KanbanView items={paginatedItems} onItemClick={handleItemClick} />
      default:
        return null
    }
  }

  const renderDetailsPane = () => {
    const id = searchParams.get('id')
    const item = items.find(i => i.id === Number(id))

    if (!item) return null

    return (
      <div className="absolute inset-y-0 right-0 w-1/3 bg-white shadow-lg p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClosePane}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </div>
    )
  }

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClosePane();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return (
    <>
      <ZeroTrust
        schema={ItemViewerSchema}
        props={{ items, onSearch, options }}
        actionLevel="error"
        componentName="ItemViewerComponent"
      />
      <div className={`space-y-4 ${heightBehaviour === 'Full' ? 'h-[calc(100vh-4rem)] flex flex-col' : ''} relative`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('card')}
              className={viewMode === 'card' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Card view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? 'bg-primary text-primary-foreground' : ''}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Calendar view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('kanban')}
              className={viewMode === 'kanban' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Columns className="h-4 w-4" />
              <span className="sr-only">Kanban view</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <TokenInput
              properties={properties!}
              value={""}
              onChange={(value, hasErrors, errors) => {
                if (hasErrors) {
                  kWarn("component", "Errors in input", errors)
                  return
                }
                handleSearch(value)
              }}
              mode="edit"
              className="mb-4 light:bg-white dark:bg-gray-800"
            />
            <Select onValueChange={(value) => setCurrentPage(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Page" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Page {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={heightBehaviour === 'Full' ? 'flex-grow overflow-auto' : ''}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: pageSize }).map((_, index) => (
                  <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              renderView()
            ) : (
              <div className="text-center py-8">No items to display</div>
            )}
          </motion.div>
        </AnimatePresence>

        {showInfinityLoader && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
      {searchParams.get('pane') === 'details' && renderDetailsPane()}
    </>
  )
}

const properties = [
  {
    name: "continent",
    values: [
      { value: "europe", icon: <FaCircle color="red" />, color: "red" },
      { value: "north-america", icon: <FaCircle color="green" />, color: "green" },
      { value: "south-america", icon: <FaCircle color="blue" />, color: "blue" },
      { value: "asia", icon: <FaCircle color="yellow" />, color: "yellow" },
      { value: "africa", icon: <FaCircle color="purple" />, color: "purple" },
      { value: "oceania", icon: <FaCircle color="purple" />, color: "purple" },
    ],
  },
  {
    name: "population",
    values: [
      { value: "small", icon: <FaCircle />, color: "black" },
      { value: "+50M", icon: <FaSquare />, color: "black" },
      { value: "+250M", icon: <FaStar />, color: "black" },
    ],
  },
]

export const examplesItemViewer: ComponentDoc[] = [
  {
    id: 'ItemViewer',
    name: 'ItemViewer',
    description: 'A versatile component for displaying country data in various view modes',
    usage: `
import { ItemViewerComponent } from './item-viewer'

// Sample data and properties are already included in the component file

export default function MyPage() {
  return (
    <ItemViewerComponent
      items={countries}
      properties={properties}
      onSearch={(query) => console.log('Search query:', query)}
      options={{ pageSize: 5, heightBehaviour: 'Full' }}
    />
  )
}
`,
    example: (
      <ItemViewerComponent
        items={countries}
        properties={properties}
        onSearch={(query) => kInfo("component", 'Search query:', query)}
        options={{ pageSize: 10, heightBehaviour: 'Full' }}
      />
    ),
  }
]