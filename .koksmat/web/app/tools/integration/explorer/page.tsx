"use client"
import { Tool, ToolSearchComponent } from '@/components/tool-search'
import React from 'react'



const mockTools: Tool[] = [
  { id: '1', name: 'Hammer', description: 'A tool for driving nails' },
  { id: '2', name: 'Screwdriver', description: 'A tool for turning screws' },
  { id: '3', name: 'Wrench', description: 'A tool for gripping and turning nuts and bolts' },
]

export default function MyComponent() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // Implement your search logic here
  }

  const handleNewResult = (results: Tool[]) => {
    console.log('New search results:', results)
    // Handle new search results here
  }

  return (
    <ToolSearchComponent
      onSearch={handleSearch}
      onNewResult={handleNewResult}
      className="my-8"
      tools={mockTools}
    />
  )
}
