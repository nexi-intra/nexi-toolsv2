'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { ComponentDoc } from './component-documentation-hub'

// Define the Tool type
interface Tool {
  id: string
  name: string
  description: string
}

// Define the props for the ToolSearch component
interface ToolSearchProps {
  onSearch: (query: string) => void
  className?: string
}

// Mock data for tools
const mockTools: Tool[] = [
  { id: '1', name: 'Hammer', description: 'A tool for driving nails' },
  { id: '2', name: 'Screwdriver', description: 'A tool for turning screws' },
  { id: '3', name: 'Wrench', description: 'A tool for gripping and turning nuts and bolts' },
  { id: '4', name: 'Pliers', description: 'A tool for gripping and bending' },
  { id: '5', name: 'Saw', description: 'A tool for cutting wood or other materials' },
  { id: '6', name: 'Drill', description: 'A tool for making holes' },
  { id: '7', name: 'Level', description: 'A tool for determining if a surface is horizontal' },
]

export function ToolSearchComponent({ onSearch, className = '' }: ToolSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tool[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (query) {
      const filteredTools = mockTools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filteredTools)
      setShowDropdown(true)
    } else {
      setResults([])
      setShowDropdown(false)
    }
  }, [query])

  const handleSearch = () => {
    onSearch(query)
    setShowAllResults(true)
    setShowDropdown(false)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setShowDropdown(false)
    setShowAllResults(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for tools..."
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search for tools"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="absolute right-0 top-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          >
            <ul className="py-1">
              {results.slice(0, 5).map((tool) => (
                <motion.li
                  key={tool.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setQuery(tool.name)
                    setShowDropdown(false)
                  }}
                >
                  {tool.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {showAllResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <ul className="space-y-2">
            {results.map((tool) => (
              <motion.li
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border border-gray-300 rounded-md"
              >
                <h3 className="font-semibold">{tool.name}</h3>
                <p className="text-gray-600">{tool.description}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

// Example usage documentation
export const examplesToolSearch: ComponentDoc[] = [
  {
    id: 'ToolSearch',
    name: 'ToolSearch',
    description: 'A component for searching tools with predictive behavior and animated results.',
    usage: `
import ToolSearch from './ToolSearch'

function MyComponent() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // Implement your search logic here
  }

  return (
    <ToolSearch onSearch={handleSearch} className="my-8" />
  )
}
    `,
    example: (
      <ToolSearchComponent
        onSearch={(query) => console.log('Searching for:', query)}
        className="my-8"
      />
    ),
  },
]