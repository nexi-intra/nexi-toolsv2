'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, ChevronsUpDown } from "lucide-react"
import { ComponentDoc } from './component-documentation-hub'

interface KeyValuePair {
  key: string
  value: string
  sortOrder: number
}

interface KeyValueSelectorProps {
  items: KeyValuePair[]
  mode: 'view' | 'new' | 'edit'
  multiSelect: boolean
  required: boolean
  initialSelected?: string[]
  onChange: (mode: 'view' | 'new' | 'edit', selected: string[]) => void
  className?: string
}

/**
 * KeyValueSelector Component
 * 
 * This component allows users to select one or multiple key-value pairs from a list using a tagging approach.
 * It supports view, new, and edit modes, and can handle required selections.
 * In edit mode, users can remove selections and add new ones using a Command interface.
 * The component respects the sort order of items during all operations.
 * 
 * @param items - Array of key-value pairs with sort order to select from
 * @param mode - Current mode of the component (view, new, or edit)
 * @param multiSelect - Whether multiple selections are allowed
 * @param required - Whether a selection is required (only applicable in edit and new modes)
 * @param initialSelected - Initially selected keys (optional)
 * @param onChange - Callback function called when selection changes
 * @param className - Additional CSS classes to apply to the component
 */
export default function KeyValueSelector({
  items,
  mode,
  multiSelect,
  required,
  initialSelected = [],
  onChange,
  className = ''
}: KeyValueSelectorProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected)
  const [open, setOpen] = useState(false)

  const sortedItems = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items])

  const sortOrderMap = useMemo(() => {
    const map = new Map<string, number>()
    items.forEach(item => map.set(item.key, item.sortOrder))
    return map
  }, [items])

  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected])

  const handleSelect = (key: string) => {
    if (mode === 'view') return

    let newSelected: string[]
    if (multiSelect) {
      if (!selected.includes(key)) {
        newSelected = [...selected, key].sort((a, b) => (sortOrderMap.get(a) || 0) - (sortOrderMap.get(b) || 0))
      } else {
        return // Prevent adding duplicates
      }
    } else {
      newSelected = [key]
    }

    setSelected(newSelected)
    onChange(mode, newSelected)
    if (!multiSelect) setOpen(false)
  }

  const handleRemove = (key: string) => {
    if (mode === 'view') return

    const newSelected = selected.filter(item => item !== key)
    if (required && newSelected.length === 0) return // Prevent removing last item if required

    setSelected(newSelected)
    onChange(mode, newSelected)
  }

  const getLabel = (key: string) => items.find(item => item.key === key)?.value || key

  const sortedSelected = useMemo(() =>
    [...selected].sort((a, b) => (sortOrderMap.get(a) || 0) - (sortOrderMap.get(b) || 0)),
    [selected, sortOrderMap]
  )

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {sortedSelected.map(key => (
          <Badge key={key} variant="secondary" className="text-sm">
            {getLabel(key)}
            {mode !== 'view' && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemove(key)}
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
                  : getLabel(selected[0])}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search items..." />
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {sortedItems.map(item => (
                  <CommandItem
                    key={item.key}
                    onSelect={() => handleSelect(item.key)}
                    disabled={selected.includes(item.key)}
                  >
                    {item.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {required && mode !== 'view' && <p className="text-sm text-red-500 mt-2">* Selection required</p>}
    </div>
  )
}

// Example usage documentation
export const examplesKeyValueSelector: ComponentDoc[] = [
  {
    id: 'KeyValueSelector-SingleSelect-Required-Edit',
    name: 'KeyValueSelector (Single Select, Required, Edit Mode)',
    description: 'A component for selecting a single required key-value pair in edit mode using a tagging approach, respecting sort order.',
    usage: `
import KeyValueSelector from './KeyValueSelector'

const items = [
  { key: 'option1', value: 'Option 1', sortOrder: 2 },
  { key: 'option2', value: 'Option 2', sortOrder: 1 },
  { key: 'option3', value: 'Option 3', sortOrder: 3 },
]

<KeyValueSelector
  items={items}
  mode="edit"
  multiSelect={false}
  required={true}
  initialSelected={['option1']}
  onChange={(mode, selected) => console.log(mode, selected)}
/>
    `,
    example: (
      <KeyValueSelector
        items={[
          { key: 'option1', value: 'Option 1', sortOrder: 2 },
          { key: 'option2', value: 'Option 2', sortOrder: 1 },
          { key: 'option3', value: 'Option 3', sortOrder: 3 },
        ]}
        mode="edit"
        multiSelect={false}
        required={true}
        initialSelected={['option1']}
        onChange={(mode, selected) => console.log(mode, selected)}
      />
    ),
  },
  {
    id: 'KeyValueSelector-MultiSelect-NotRequired-Edit',
    name: 'KeyValueSelector (Multi Select, Not Required, Edit Mode)',
    description: 'A component for selecting multiple optional key-value pairs in edit mode using a tagging approach, respecting sort order.',
    usage: `
import KeyValueSelector from './KeyValueSelector'

const items = [
  { key: 'option1', value: 'Option 1', sortOrder: 3 },
  { key: 'option2', value: 'Option 2', sortOrder: 1 },
  { key: 'option3', value: 'Option 3', sortOrder: 2 },
  { key: 'option4', value: 'Option 4', sortOrder: 4 },
]

<KeyValueSelector
  items={items}
  mode="edit"
  multiSelect={true}
  required={false}
  initialSelected={['option1', 'option3']}
  onChange={(mode, selected) => console.log(mode, selected)}
/>
    `,
    example: (
      <KeyValueSelector
        items={[
          { key: 'option1', value: 'Option 1', sortOrder: 3 },
          { key: 'option2', value: 'Option 2', sortOrder: 1 },
          { key: 'option3', value: 'Option 3', sortOrder: 2 },
          { key: 'option4', value: 'Option 4', sortOrder: 4 },
        ]}
        mode="edit"
        multiSelect={true}
        required={false}
        initialSelected={['option1', 'option3']}
        onChange={(mode, selected) => console.log(mode, selected)}
      />
    ),
  },
  {
    id: 'KeyValueSelector-MultiSelect-Required-View',
    name: 'KeyValueSelector (Multi Select, Required, View Mode)',
    description: 'A component for viewing multiple selected key-value pairs using a tagging approach, respecting sort order.',
    usage: `
import KeyValueSelector from './KeyValueSelector'

const items = [
  { key: 'option1', value: 'Option 1', sortOrder: 2 },
  { key: 'option2', value: 'Option 2', sortOrder: 3 },
  { key: 'option3', value: 'Option 3', sortOrder: 1 },
]

<KeyValueSelector
  items={items}
  mode="view"
  multiSelect={true}
  required={true}
  initialSelected={['option1', 'option3']}
  onChange={(mode, selected) => console.log(mode, selected)}
/>
    `,
    example: (
      <KeyValueSelector
        items={[
          { key: 'option1', value: 'Option 1', sortOrder: 2 },
          { key: 'option2', value: 'Option 2', sortOrder: 3 },
          { key: 'option3', value: 'Option 3', sortOrder: 1 },
        ]}
        mode="view"
        multiSelect={true}
        required={true}
        initialSelected={['option1', 'option3']}
        onChange={(mode, selected) => console.log(mode, selected)}
      />
    ),
  },
]