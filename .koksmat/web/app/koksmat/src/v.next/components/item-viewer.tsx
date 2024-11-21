'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, Calendar, Columns, ChevronLeft, ChevronRight, X, Edit, Copy, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ZeroTrust } from '@/components/zero-trust'
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client"
import { z, ZodObject, ZodSchema } from 'zod'
import { ComponentDoc } from '@/components/component-documentation-hub'
import TokenInput from '@/components/token-input'
import { PropertySchema } from '@/components/token-input-internal'
import { FaCircle, FaSquare, FaStar } from 'react-icons/fa'
import { useSearchParams, useRouter } from 'next/navigation'
import { CardViewItems } from './CardView'
import { TableView } from './TableView'
import { ListView } from './ListView'
import { Base, EditItemFunction, RenderItemFunction, ViewMode } from './_shared'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Schema for countries
const CountrySchema = z.object({
  id: z.number().int().positive().describe(`unique id
    The unique identifier of the country`),
  name: z.string().min(1).describe(`Country name
    The name of the country`),
  searchIndex: z.string().min(1).describe("The search index of the country"),
  continent: z.string().min(1).describe(`Continent
    The continent the country is located in`),
  population: z.number().int().positive().describe(`Population    
    The population of the country`),
  capital: z.string().min(1).describe(`Capital 
    The capital of the country`),
  constitutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').describe(`Constitution date
     The date the constitution was signed`),
})

export type Country = z.infer<typeof CountrySchema>

// Schema for arrays of countries
const CountriesArraySchema = z.array(CountrySchema)

// Sample data
const countries: Country[] = [
  { id: 1, name: 'United States', continent: 'North America', population: 331002651, capital: 'Washington, D.C.', constitutionDate: '1787-09-17', searchIndex: "abc" },
  { id: 2, name: 'China', continent: 'Asia', population: 1439323776, capital: 'Beijing', constitutionDate: '1982-12-04', searchIndex: "abc" },
  { id: 3, name: 'India', continent: 'Asia', population: 1380004385, capital: 'New Delhi', constitutionDate: '1950-01-26', searchIndex: "abc" },
  { id: 4, name: 'Brazil', continent: 'South America', population: 212559417, capital: 'Brasília', constitutionDate: '1988-10-05', searchIndex: "abc" },
  { id: 5, name: 'Russia', continent: 'Europe/Asia', population: 145934462, capital: 'Moscow', constitutionDate: '1993-12-25', searchIndex: "abc" },
  { id: 6, name: 'Japan', continent: 'Asia', population: 126476461, capital: 'Tokyo', constitutionDate: '1947-05-03', searchIndex: "abc" },
  { id: 7, name: 'Germany', continent: 'Europe', population: 83783942, capital: 'Berlin', constitutionDate: '1949-05-23', searchIndex: "abc" },
  { id: 8, name: 'United Kingdom', continent: 'Europe', population: 67886011, capital: 'London', constitutionDate: '1215-06-15', searchIndex: "abc" },
  { id: 9, name: 'France', continent: 'Europe', population: 65273511, capital: 'Paris', constitutionDate: '1958-10-04', searchIndex: "abc" },
  { id: 10, name: 'Italy', continent: 'Europe', population: 60461826, capital: 'Rome', constitutionDate: '1948-01-01', searchIndex: "abc" },
  { id: 11, name: 'South Africa', continent: 'Africa', population: 59308690, capital: 'Pretoria, Cape Town, Bloemfontein', constitutionDate: '1996-12-10', searchIndex: "abc" },
  { id: 12, name: 'South Korea', continent: 'Asia', population: 51269185, capital: 'Seoul', constitutionDate: '1948-07-17', searchIndex: "abc" },
  { id: 13, name: 'Colombia', continent: 'South America', population: 50882891, capital: 'Bogotá', constitutionDate: '1991-07-04', searchIndex: "abc" },
  { id: 14, name: 'Spain', continent: 'Europe', population: 46754778, capital: 'Madrid', constitutionDate: '1978-12-29', searchIndex: "abc" },
  { id: 15, name: 'Argentina', continent: 'South America', population: 45195774, capital: 'Buenos Aires', constitutionDate: '1853-05-01', searchIndex: "abc" },
]

// Validate the sample data
CountriesArraySchema.parse(countries)




// const ItemViewerSchema = z.object({
//   items: CountriesArraySchema,
//   onSearch: z.function().optional(),
//   properties: z.array(PropertySchema).optional(),
//   options: z.object({
//     pageSize: z.number().optional(),
//     heightBehaviour: z.enum(['Dynamic', 'Full']).default('Full')
//   }).optional()
// })

// type ItemViewerProps = z.infer<typeof ItemViewerSchema>
// type ItemViewerProps<T> = {
//   schema: ZodSchema<T>;
//   items: T[];
//   renderItem: (item: T) => React.ReactNode;
//   childComponent?: (schema: ZodSchema<T>, item: T) => React.ReactNode; // Optional child component for schema-specific rendering
// };
// Define PropertySchema and other supporting schemas
// const PropertySchema = z.object({
//   key: z.string(),
//   value: z.any(),
// });

type Options = {
  pageSize?: number;
  heightBehaviour?: 'Dynamic' | 'Full';
};

// Extend ViewItemsProps to include additional props
type ViewItemsProps<T extends Base> = {
  schema: ZodObject<Record<string, z.ZodTypeAny>>;
  items: T[];
  renderItem?: RenderItemFunction<T>;
  editItem?: EditItemFunction<T>;
  onSearch?: (query: string) => void;
  properties?: z.infer<typeof PropertySchema>[];
  options?: Options;

};

// function ViewItems<T>({
//   schema,
//   items,
//   renderItem,
//   onSearch,
//   properties,
//   options,
//   childComponent,
// }: ViewItemsProps<T>)
export function ItemViewerComponent<T extends { id: number, name: string, searchIndex: string, calculatedSearchIndex?: string }>
  ({ items, schema, onSearch, properties, renderItem, editItem, options = { heightBehaviour: 'Full' } }
    : ViewItemsProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showInfinityLoader, setShowInfinityLoader] = useState(false)
  const [filteredItems, setFilteredItems] = useState(items)

  const searchParams = useSearchParams()
  const router = useRouter()

  const pageSize = options.pageSize || 10
  const totalPages = Math.max(1, Math.ceil(filteredItems?.length / pageSize))
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

  useEffect(() => {
    setFilteredItems(items)
    setCurrentPage(1)
  }, [items])


  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase()

    const filtered = items.filter((item) => {
      if (item?.calculatedSearchIndex) {
        return item?.calculatedSearchIndex?.toLowerCase().includes(lowercaseQuery)
      }
      else return item?.searchIndex?.toLowerCase().includes(lowercaseQuery)

    }

    )
    setFilteredItems(filtered)
    setCurrentPage(1)
    if (onSearch) {
      onSearch(query)
    }
  }

  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleItemClick = (item: T) => {

    const params = new URLSearchParams(searchParams)
    params.set('pane', 'details')
    params.set('id', item.id.toString())
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
        return <CardViewItems renderItem={renderItem} items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      case 'table':
        return <TableView items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      case 'list':
        return <ListView items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      default:
        return null
    }
  }

  function renderDetailsPane<T>(editItem?: EditItemFunction<T>) {
    const id = searchParams.get('id')
    const item = items.find(i => i.id === Number(id))

    if (!item) return null

    return (
      <div className="absolute z-[1000] inset-y-0 right-0 w-1/3 bg-white shadow-lg p-4 overflow-y-auto">
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
        {editItem && (editItem("edit", item.id))}
        {!editItem && <pre>{JSON.stringify(item, null, 2)}</pre>}
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
            <CreateItem />
            {/* <Button
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
            </Button> */}
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
              <div >
                {Array.from({ length: pageSize }).map((_, index) => (
                  <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : filteredItems?.length > 0 ? (
              <div className=''>
                {renderView()}
              </div>
            ) : (

              <div className="text-center py-8">No items to display
                {editItem &&
                  <CreateItem />

                }

              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {showInfinityLoader && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {filteredItems?.length > 0 && (
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

  function CreateItem() {
    return <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new <span className='text-slate-500 pl-2'>Preview</span></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[40vh]">
        <DialogHeader>
          <DialogTitle>Create a new record</DialogTitle>

        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          {editItem?.("new", 0)}
        </ScrollArea>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  }
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
// Schema for countries
const CountrySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  continent: z.string().min(1),
  population: z.number().int().positive(),
  capital: z.string().min(1),
  constitutionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
})

export type Country = z.infer<typeof CountrySchema>

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


export default function MyPage() {
  return (
      <ItemViewerComponent
        items={countries}
        properties={properties}
        onSearch={(query) => kInfo("component", 'Search query:', query)}
        options={{ pageSize: 10, heightBehaviour: 'Full' }}
        schema={CountrySchema} />

  )
}
`,
    example: (

      <ItemViewerComponent
        items={countries}
        renderItem={(item, mode) => (<div>{item.name + "(" + item.continent + ")"}</div>)

        }
        properties={[]}
        onSearch={(query) => kInfo("component", 'Search query:', query)}
        options={{ pageSize: 10, heightBehaviour: 'Full' }}
        schema={CountrySchema} />
    ),
  }
]