'use client'

import { useState } from 'react'
import { Search, Plus, Download, Upload, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TreeNavigator from './tree-navigator'
import ToolCards from './tool-cards'
import { MyToolList } from './my-tool-list'
import TreeView from './tree-editor'

// Mock data for demonstration
const sharePointNews = [
  { id: 1, title: "New SharePoint feature released", content: "Exciting new collaboration tools now available..." },
  { id: 2, title: "Upcoming maintenance schedule", content: "Please be aware of planned downtime this weekend..." },
  { id: 3, title: "SharePoint training webinar", content: "Join us for a free training session on advanced SharePoint usage..." },
]

const pinnedTools = [
  { id: 1, name: "Document Library", description: "Access and manage your documents" },
  { id: 2, name: "Team Sites", description: "Collaborate with your team members" },
  { id: 3, name: "Power Apps", description: "Create custom business applications" },
]

export default function AppLauncher() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddTool = () => {
    console.log('Add new tool')
  }

  const handleImportFavorites = () => {
    console.log('Import from browser favorites')
  }

  const handleExportToExcel = () => {
    console.log('Export to Excel')
  }

  const handleImportFromExcel = () => {
    console.log('Import from Excel')
  }

  return (
    <div className=" mx-auto p-4">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleAddTool}>
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new tool</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleImportFavorites}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import from browser favorites</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleExportToExcel}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export to Excel</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleImportFromExcel}>
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import from Excel</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column: Tree Navigator and SharePoint News */}
        <div className="w-full lg:w-1/4 space-y-4">


          <TreeView />

          <Card>
            <CardHeader>
              <CardTitle>SharePoint News</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sharePointNews.map((news) => (
                  <li key={news.id}>
                    <h3 className="font-semibold">{news.title}</h3>
                    <p className="text-sm text-gray-600">{news.content}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Searched/Suggested Tools */}
        <div className="w-full lg:w-1/2">
          <MyToolList />
        </div>

        {/* Right Column: Pinned Tools */}
        <div className="w-full lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Pinned Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pinnedTools.map((tool) => (
                  <Card key={tool.id}>
                    <CardHeader>
                      <CardTitle>{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

