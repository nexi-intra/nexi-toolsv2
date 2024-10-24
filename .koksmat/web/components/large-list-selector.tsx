'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { X, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { ComponentDoc } from './component-documentation-hub'

interface KeyValuePair {
  key: string
  value: string
  sortOrder: number
}

interface SearchResult {
  items: KeyValuePair[]
  currentPage: number
  totalPages: number
}

interface LargeListSelectorProps {
  mode: 'view' | 'new' | 'edit'
  multiSelect: boolean
  required: boolean
  initialSelected?: string[]
  onChange: (mode: 'view' | 'new' | 'edit', selected: string[]) => void
  onSearch: (query: string, page: number) => Promise<SearchResult>
  className?: string
}

/**
 * LargeListSelector Component
 * 
 * This component allows users to select one or multiple items from a large list using a search-based approach.
 * It supports view, new, and edit modes, and can handle required selections.
 * The component uses a callback function for searching, supporting pagination and displaying loading states.
 * 
 * @param mode - Current mode of the component (view, new, or edit)
 * @param multiSelect - Whether multiple selections are allowed
 * @param required - Whether a selection is required (only applicable in edit and new modes)
 * @param initialSelected - Initially selected keys (optional)
 * @param onChange - Callback function called when selection changes
 * @param onSearch - Callback function for searching items
 * @param className - Additional CSS classes to apply to the component
 */
export function LargeListSelectorComponent({
  mode,
  multiSelect,
  required,
  initialSelected = [],
  onChange,
  onSearch,
  className = ''
}: LargeListSelectorProps) {
  const [selected, setSelected] = useState<KeyValuePair[]>(initialSelected.map(key => ({ key, value: key, sortOrder: 0 })))
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KeyValuePair[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const performSearch = useCallback(async (query: string, page: number) => {
    setIsLoading(true)
    try {
      const result = await onSearch(query, page)
      setSearchResults(result.items)
      setCurrentPage(result.currentPage)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [onSearch])

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, 1)
    }
  }, [searchQuery, performSearch])

  const handleSelect = (item: KeyValuePair) => {
    if (mode === 'view') return

    let newSelected: KeyValuePair[]
    if (multiSelect) {
      if (!selected.some(s => s.key === item.key)) {
        newSelected = [...selected, item].sort((a, b) => a.sortOrder - b.sortOrder)
      } else {
        return // Prevent adding duplicates
      }
    } else {
      newSelected = [item]
    }

    setSelected(newSelected)
    onChange(mode, newSelected.map(s => s.key))
    if (!multiSelect) setOpen(false)
  }

  const handleRemove = (key: string) => {
    if (mode === 'view') return

    const newSelected = selected.filter(item => item.key !== key)
    if (required && newSelected.length === 0) return // Prevent removing last item if required

    setSelected(newSelected)
    onChange(mode, newSelected.map(s => s.key))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      performSearch(searchQuery, newPage)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {selected.map(item => (
          <Badge key={item.key} variant="secondary" className="text-sm">
            {item.value}
            {mode !== 'view' && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(item.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
      {mode !== 'view' && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selected.length === 0
                ? "Select items..."
                : multiSelect
                ? `${selected.length} item${selected.length > 1 ? 's' : ''} selected`
                : selected[0].value}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search items..." onValueChange={setSearchQuery} />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <CommandItem key={index} disabled>
                        <Skeleton className="h-4 w-full" />
                      </CommandItem>
                    ))
                  ) : (
                    searchResults.map(item => (
                      <CommandItem
                        key={item.key}
                        onSelect={() => handleSelect(item)}
                        disabled={selected.some(s => s.key === item.key)}
                      >
                        {item.value}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {required && mode !== 'view' && <p className="text-sm text-red-500 mt-2">* Selection required</p>}
    </div>
  )
}

// Example usage documentation
export const examplesLargeListSelector: ComponentDoc[] = [
  {
    id: 'LargeListSelector-SingleSelect-Required-Edit',
    name: 'LargeListSelector (Single Select, Required, Edit Mode)',
    description: 'A component for selecting a single required item from a large list using a search-based approach.',
    usage: `
import LargeListSelector from './LargeListSelector'

const mockSearch = async (query: string, page: number): Promise<SearchResult> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const allItems = Array.from({ length: 100 }, (_, i) => ({
    key: \`item-\${i + 1}\`,
    value: \`Item \${i + 1}\`,
    sortOrder: i + 1
  }))
  
  const filteredItems = allItems.filter(item => 
    item.value.toLowerCase().includes(query.toLowerCase())
  )
  
  const pageSize = 10
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  return {
    items: filteredItems.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(filteredItems.length / pageSize)
  }
}

<LargeListSelector
  mode="edit"
  multiSelect={false}
  required={true}
  initialSelected={[]}
  onChange={(mode, selected) => console.log(mode, selected)}
  onSearch={mockSearch}
/>
    `,
    example: (
      <LargeListSelectorComponent
        mode="edit"
        multiSelect={false}
        required={true}
        initialSelected={[]}
        onChange={(mode, selected) => console.log(mode, selected)}
        onSearch={async (query: string, page: number) => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const allItems = Array.from({ length: 100 }, (_, i) => ({
            key: `item-${i + 1}`,
            value: `Item ${i + 1}`,
            sortOrder: i + 1
          }))
          const filteredItems = allItems.filter(item => 
            item.value.toLowerCase().includes(query.toLowerCase())
          )
          const pageSize = 10
          const startIndex = (page - 1) * pageSize
          const endIndex = startIndex + pageSize
          return {
            items: filteredItems.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(filteredItems.length / pageSize)
          }
        }}
      />
    ),
  },
  {
    id: 'LargeListSelector-MultiSelect-NotRequired-Edit',
    name: 'LargeListSelector (Multi Select, Not Required, Edit Mode)',
    description: 'A component for selecting multiple optional items from a large list using a search-based approach.',
    usage: `
import LargeListSelector from './LargeListSelector'

const mockSearch = async (query: string, page: number): Promise<SearchResult> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const allItems = Array.from({ length: 100 }, (_, i) => ({
    key: \`item-\${i + 1}\`,
    value: \`Item \${i + 1}\`,
    sortOrder: i + 1
  }))
  
  const filteredItems = allItems.filter(item => 
    item.value.toLowerCase().includes(query.toLowerCase())
  )
  
  const pageSize = 10
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  return {
    items: filteredItems.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(filteredItems.length / pageSize)
  }
}

<LargeListSelector
  mode="edit"
  multiSelect={true}
  required={false}
  initialSelected={['item-1', 'item-3']}
  onChange={(mode, selected) => console.log(mode, selected)}
  onSearch={mockSearch}
/>
    `,
    example: (
      <LargeListSelectorComponent
        mode="edit"
        multiSelect={true}
        required={false}
        initialSelected={['item-1', 'item-3']}
        onChange={(mode, selected) => console.log(mode, selected)}
        onSearch={async (query: string, page: number) => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const allItems = Array.from({ length: 100 }, (_, i) => ({
            key: `item-${i + 1}`,
            value: `Item ${i + 1}`,
            sortOrder: i + 1
          }))
          const filteredItems = allItems.filter(item => 
            item.value.toLowerCase().includes(query.toLowerCase())
          )
          const pageSize = 10
          const startIndex = (page - 1) * pageSize
          const endIndex = startIndex + pageSize
          return {
            items: filteredItems.slice(startIndex, endIndex),
            currentPage: page,
            totalPages: Math.ceil(filteredItems.length / pageSize)
          }
        }}
      />
    ),
  },
]