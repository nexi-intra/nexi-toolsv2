'use client'

import React, { useState, useEffect } from 'react'
import { ComponentDoc } from './component-documentation-hub'
import { Search, ChevronDown, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

/**
 * Tag Component
 * 
 * This component allows viewing and selecting one or more tags, with a dropdown interface in edit mode.
 * It supports view, new, and edit modes, and can be configured to allow multiple selections and be required.
 * 
 * @param tags - Array of available tags with name, color, and description
 * @param selectedTags - Array of initially selected tag names
 * @param allowMulti - Boolean to allow multiple tag selection
 * @param required - Boolean to make tag selection required
 * @param mode - 'view' | 'new' | 'edit'
 * @param onChange - Callback function called with current mode and selected tags
 * @param className - Additional CSS classes for the component
 * @param canEditTagList - Boolean to allow editing of the tag list
 * @param onEditTagList - Callback function called when edit tag list is clicked
 */
interface Tag {
  name: string
  color: string
  description: string
}

interface TagProps {
  tags: Tag[]
  selectedTags: string[]
  allowMulti: boolean
  required: boolean
  mode: 'view' | 'new' | 'edit'
  onChange: (mode: 'view' | 'new' | 'edit', selectedTags: string[]) => void
  className?: string
  canEditTagList?: boolean
  onEditTagList?: () => void
}

export default function Tag({
  tags,
  selectedTags: initialSelectedTags,
  allowMulti,
  required,
  mode: initialMode,
  onChange,
  className = '',
  canEditTagList = false,
  onEditTagList,
}: TagProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags)
  const [mode, setMode] = useState<'view' | 'new' | 'edit'>(initialMode)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setSelectedTags(initialSelectedTags)
  }, [initialSelectedTags])

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    onChange(mode, selectedTags)
  }, [selectedTags, onChange])

  const handleTagToggle = (tagName: string) => {
    if (mode === 'view') return

    if (allowMulti) {
      setSelectedTags(prev =>
        prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
      )
    } else {
      setSelectedTags(prev => prev.includes(tagName) ? [] : [tagName])
      setOpen(false)
    }
  }

  const renderTags = () => {
    return selectedTags.map(tagName => {
      const tag = tags.find(t => t.name === tagName)
      return tag ? (
        <span
          key={tag.name}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2"
          style={{ backgroundColor: tag.color, color: getContrastColor(tag.color) }}
        >
          {tag.name}
          {mode !== 'view' && (
            <button
              onClick={() => handleTagToggle(tag.name)}
              className="ml-1 focus:outline-none"
              aria-label={`Remove ${tag.name} tag`}
            >
              ×
            </button>
          )}
        </span>
      ) : null
    })
  }

  return (
    <div className={`w-full  ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={mode === 'view'}
          >
            {selectedTags.length > 0 ? (
              <div className="flex flex-nowrap  overflow-hidden">
                {renderTags()}
              </div>
            ) : (
              "Select tags..."
            )}
            {mode !== 'view' &&
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {tags.map(tag => (
                <CommandItem
                  key={tag.name}
                  onSelect={() => handleTagToggle(tag.name)}
                  className="flex items-center"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span>{tag.name}</span>
                  {tag.description && (
                    <span className="ml-2 text-sm text-gray-500">- {tag.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          {canEditTagList && (
            <Button
              variant="ghost"
              className="w-full justify-start pl-2 mb-1"
              onClick={() => {
                setOpen(false)
                onEditTagList?.()
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Edit labels
            </Button>
          )}
        </PopoverContent>
      </Popover>
      {mode !== 'view' && required && selectedTags.length === 0 && (
        <p className="text-red-500 text-xs mt-1">Please select at least one tag</p>
      )}
    </div>
  )
}

// Utility function to determine text color based on background color
function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? 'black' : 'white'
}

// Example usage and documentation
export const examplesTag: ComponentDoc[] = [
  {
    id: 'TagDropdown',
    name: 'Tag (Dropdown Style)',
    description: 'Tag component with a dropdown interface for selecting tags.',
    usage: `
<Tag
  tags={[
    { name: 'bug', color: '#d73a4a', description: 'Something isn\'t working' },
    { name: 'documentation', color: '#0075ca', description: 'Improvements or additions to documentation' },
    { name: 'duplicate', color: '#cfd3d7', description: 'This issue or pull request already exists' },
    { name: 'enhancement', color: '#a2eeef', description: 'New feature or request' },
    { name: 'good first issue', color: '#7057ff', description: 'Good for newcomers' }
  ]}
  selectedTags={['bug', 'documentation']}
  allowMulti={true}
  required={false}
  mode="edit"
  onChange={(mode, selectedTags) => console.log(mode, selectedTags)}
  canEditTagList={true}
  onEditTagList={() => console.log('Edit tag list clicked')}
/>
    `,
    example: (
      <Tag
        tags={[
          { name: 'bug', color: '#d73a4a', description: 'Something isn\'t working' },
          { name: 'documentation', color: '#0075ca', description: 'Improvements or additions to documentation' },
          { name: 'duplicate', color: '#cfd3d7', description: 'This issue or pull request already exists' },
          { name: 'enhancement', color: '#a2eeef', description: 'New feature or request' },
          { name: 'good first issue', color: '#7057ff', description: 'Good for newcomers' }
        ]}
        selectedTags={['bug', 'documentation']}
        allowMulti={true}
        required={false}
        mode="edit"
        onChange={(mode, selectedTags) => console.log(mode, selectedTags)}
        canEditTagList={true}
        onEditTagList={() => console.log('Edit tag list clicked')}
      />
    ),
  },
]