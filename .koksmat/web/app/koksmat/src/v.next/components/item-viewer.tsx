'use client'

import { useState, useEffect, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, Calendar, Columns, ChevronLeft, ChevronRight, X, Edit, Copy, MoreHorizontal, Table } from 'lucide-react'
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
import { AddItemFunction, Base, EditItemFunction, RenderItemFunction, ViewItemOptionsProps, ViewMode } from './_shared'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { se } from 'date-fns/locale'
import { FormModeType, GenericTableEditor } from './form-generic-table'
import { useLanguage } from "@/components/language-context"



export type SupportedLanguage = "en" | "da" | "it";

const translationSchema = z.object({
  en: z.object({
    cardView: z.string(),
    tableView: z.string(),
    listView: z.string(),
    addNew: z.string(),
    page: z.string(),
    noItemsFound: z.string(),
    previous: z.string(),
    next: z.string(),
    pageOf: z.string(),
    itemDetails: z.string(),
    createNewRecord: z.string(),
    edit: z.string(),
    copy: z.string(),
    moreOptions: z.string(),
    close: z.string(),
  }),
  da: z.object({
    cardView: z.string(),
    tableView: z.string(),
    listView: z.string(),
    addNew: z.string(),
    page: z.string(),
    noItemsFound: z.string(),
    previous: z.string(),
    next: z.string(),
    pageOf: z.string(),
    itemDetails: z.string(),
    createNewRecord: z.string(),
    edit: z.string(),
    copy: z.string(),
    moreOptions: z.string(),
    close: z.string(),
  }),
  it: z.object({
    cardView: z.string(),
    tableView: z.string(),
    listView: z.string(),
    addNew: z.string(),
    page: z.string(),
    noItemsFound: z.string(),
    previous: z.string(),
    next: z.string(),
    pageOf: z.string(),
    itemDetails: z.string(),
    createNewRecord: z.string(),
    edit: z.string(),
    copy: z.string(),
    moreOptions: z.string(),
    close: z.string(),
  }),
});

export type TranslationType = z.infer<typeof translationSchema>;

export const translations: TranslationType = {
  en: {
    cardView: "Card view",
    tableView: "Table view",
    listView: "List view",
    addNew: "Add new",
    page: "Page",
    noItemsFound: "No items found",
    previous: "Previous",
    next: "Next",
    pageOf: "Page {current} of {total}",
    itemDetails: "Item details",
    createNewRecord: "Create a new record",
    edit: "Edit",
    copy: "Copy",
    moreOptions: "More options",
    close: "Close",
  },
  da: {
    cardView: "Kortvisning",
    tableView: "Tabelvisning",
    listView: "Listevisning",
    addNew: "Tilføj ny",
    page: "Side",
    noItemsFound: "Ingen elementer fundet",
    previous: "Forrige",
    next: "Næste",
    pageOf: "Side {current} af {total}",
    itemDetails: "Elementdetaljer",
    createNewRecord: "Opret en ny post",
    edit: "Rediger",
    copy: "Kopier",
    moreOptions: "Flere muligheder",
    close: "Luk",
  },
  it: {
    cardView: "Vista a schede",
    tableView: "Vista tabella",
    listView: "Vista elenco",
    addNew: "Aggiungi nuovo",
    page: "Pagina",
    noItemsFound: "Nessun elemento trovato",
    previous: "Precedente",
    next: "Successivo",
    pageOf: "Pagina {current} di {total}",
    itemDetails: "Dettagli elemento",
    createNewRecord: "Crea un nuovo record",
    edit: "Modifica",
    copy: "Copia",
    moreOptions: "Altre opzioni",
    close: "Chiudi",
  },
};


type ViewItemsProps<T extends Base> = {
  schema: ZodObject<Record<string, z.ZodTypeAny>>;
  items: T[];
  renderItem?: RenderItemFunction<T>;
  editItem?: EditItemFunction<T>;
  addItem?: AddItemFunction;
  onSearch?: (query: string) => void;
  properties?: z.infer<typeof PropertySchema>[];
  options?: ViewItemOptionsProps;
  searchFor?: string;
  tableName: string;
  databaseName: string;
  isLoading?: boolean;
};

export function ItemViewerComponent<T extends { id: number, name: string, searchIndex: string, calculatedsearchindex?: string }>
  ({ searchFor = "", items, isLoading, schema, onSearch, properties, renderItem, editItem, addItem, tableName, databaseName, options = { heightBehaviour: 'Full', defaultViewMode: 'card', hideToolbar: false } }
    : ViewItemsProps<T>) {
  const [viewMode, setViewMode] = useState<ViewMode>(options?.defaultViewMode || 'card')
  const [currentPage, setCurrentPage] = useState(1)
  const [showInfinityLoader, setShowInfinityLoader] = useState(false)
  const [filteredItems, setFilteredItems] = useState(items)
  const [selectedId, setselectedId] = useState<number | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language as SupportedLanguage]

  const pageSize = options.pageSize || 10
  const totalPages = Math.max(1, Math.ceil(filteredItems?.length / pageSize))
  const heightBehaviour = options.heightBehaviour || 'Full'
  const showToolbar = !options.hideToolbar

  function ShowItem({ id }: { id: number }) {
    const [mode, setmode] = useState<FormModeType>("view")
    const [debug, setdebug] = useState(false)
    return <Dialog onOpenChange={(open) => {
      if (!open) {
        setselectedId(null)
      }
    }} open={true}>
      <DialogTrigger asChild>
        <Button variant="outline">{t?.itemDetails}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t?.itemDetails}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <div className='max-h-[80vh] max-w-[80vw] overflow-auto '>
          <GenericTableEditor schema={schema} tableName={tableName} databaseName={databaseName} id={id} defaultMode={mode}
            showJSON={debug}
            onUpdated={() => setselectedId(null)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setdebug(!debug)}>Debug</Button>
          <Button variant="outline" onClick={() => setselectedId(null)}>{t?.close}</Button>
          <Button variant="outline" onClick={() => setmode("edit")}>{t?.edit}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  }

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

  useEffect(() => {
    if (searchFor) {
      handleSearch(searchFor)
    } else {
      setFilteredItems(items)
    }
  }, [searchFor])

  const handleSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase()

    const filtered = items.filter((item) => {
      if (item?.calculatedsearchindex) {
        return item?.calculatedsearchindex?.toLowerCase().includes(lowercaseQuery)
      }
      else return item?.searchIndex?.toLowerCase().includes(lowercaseQuery)
    })
    setFilteredItems(filtered)
    setCurrentPage(1)
    if (onSearch) {
      onSearch(query)
    }
  }

  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleItemClick = (item: T) => {
    setselectedId(item.id)
  }

  const handleClosePane = () => {
    setselectedId(null)
  }

  const renderView = () => {
    switch (viewMode) {
      case 'card':
        return <CardViewItems renderItem={renderItem} items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      case 'table':
        return <TableView items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      case 'list':
        return <ListView items={paginatedItems} onItemClick={handleItemClick} schema={schema} />
      case "raw":
        return (<Fragment>
          {items.map((item, key) => (
            <Fragment key={key} >
              {renderItem ? renderItem(item, "raw") : null}
            </Fragment>
          ))}
        </Fragment>)
      default:
        return null
    }
  }

  function renderDetailsPane<T>(editItem?: EditItemFunction<T>) {
    const id = searchParams.get('id')
    const item = items.find(i => i.id === Number(id))

    if (!item) return null

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">{t?.edit}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
              <span className="sr-only">{t?.copy}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">{t?.moreOptions}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClosePane}>
              <X className="h-4 w-4" />
              <span className="sr-only">{t?.close}</span>
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
        {selectedId && <ShowItem id={selectedId} />}
        {showToolbar && (<div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('card')}
              className={viewMode === 'card' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">{t?.cardView}</span>
            </Button>
            {addItem && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">{t?.addNew}</Button>
                </DialogTrigger>
                <DialogContent >
                  <DialogHeader>
                    <DialogTitle>{t?.createNewRecord}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[80vh] w-full rounded-md border">
                    {addItem("new")}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <TokenInput
              properties={properties!}
              value={searchFor!}
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
                <SelectValue placeholder={t?.page} /><SelectValue placeholder={t?.page} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {t?.page} {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        )}
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
              <div className='flex'>
                <main className='flex-grow overflow-x-auto max-w-full'>
                  <div className="w-full">
                    {renderView()}
                  </div>
                </main>
                {searchParams.get('pane') === 'details' && (
                  <aside className="w-full md:w-64 flex-shrink-0 mt-4 md:mt-0 md:ml-4">
                    {renderDetailsPane()}
                  </aside>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                {options.componentNoItems ? (
                  options.componentNoItems
                ) : (
                  <p className="text-lg mt-4">{t?.noItemsFound}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {showInfinityLoader && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {filteredItems?.length > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t?.previous}
            </Button>
            <span>
              {t?.pageOf.replace("{current}", currentPage.toString()).replace("{total}", totalPages.toString())}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {t?.next}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
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
      <div>Visit the source code</div>
    ),
  }
]

