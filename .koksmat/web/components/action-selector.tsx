'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronDown, MoreVertical, Search, Maximize2, Minimize2, Bell, Bookmark, Calendar, Camera, Coffee, Compass, Database, Download, Eye, FilePlus, FileText, Folder, Globe, Heart, Key, Mail, Settings, User, Image, ClipboardCopy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComponentDoc } from './component-documentation-hub'

interface ActionType {
  id: string
  icon: JSX.Element
  title: string
  description: string
  majorProperties: JSX.Element
  allProperties: JSX.Element
}

type FilterOption = 'all' | 'recent' | 'favorite'

interface ActionSelectorProps {
  actions: ActionType[]
  onActionSelect: (action: ActionType) => void
  className?: string
  defaultAction?: ActionType
}

const ActionSelector: React.FC<ActionSelectorProps> = ({
  actions,
  onActionSelect,
  className = '',
  defaultAction
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | undefined>(defaultAction)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [isMaximized, setIsMaximized] = useState(false)

  const handleActionSelect = useCallback((action: ActionType) => {
    setSelectedAction(action)
    onActionSelect(action)
    setIsOpen(false)
    setIsMaximized(false)
  }, [onActionSelect])

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterOption === 'all') return matchesSearch
      if (filterOption === 'recent') {
        // Implement recent filter logic here
        return matchesSearch // && isRecent(action)
      }
      if (filterOption === 'favorite') {
        // Implement favorite filter logic here
        return matchesSearch // && isFavorite(action)
      }
      return false
    })
  }, [actions, searchTerm, filterOption])

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMaximized) {
        setIsMaximized(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMaximized])

  return (
    <div className={`flex flex-col ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            <div className="flex items-center">
              {selectedAction ? (
                <>
                  {selectedAction.icon}
                  <span className="ml-2">{selectedAction.title}</span>
                </>
              ) : (
                <span>Select an action</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`p-0 transition-all duration-200 ease-in-out ${isMaximized
            ? 'fixed inset-0 w-screen h-screen max-w-none max-h-none rounded-none'
            : 'w-[300px]'
            }`}
          style={{
            transform: isMaximized ? 'none' : undefined,
            top: isMaximized ? 0 : undefined,
            left: isMaximized ? 0 : undefined,
          }}
        >
          <div className={`p-2 space-y-2 ${isMaximized ? 'h-full flex flex-col' : ''}`}>
            <div className="flex space-x-2">
              <Input
                type="search"
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Select value={filterOption} onValueChange={(value: FilterOption) => setFilterOption(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="favorite">Favorite</SelectItem>
                </SelectContent>
              </Select>
              {/* <Button variant="outline" size="icon" onClick={toggleMaximize}>
                {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button> */}
            </div>
            <div className={`overflow-y-auto ${isMaximized ? 'flex-grow' : 'max-h-[300px]'}`}>
              {filteredActions.map((action) => (
                <Card
                  key={action.id}
                  className="mb-2 cursor-pointer hover:bg-accent"
                  onClick={() => handleActionSelect(action)}
                >
                  <CardHeader className="flex flex-row items-center space-y-0 p-3">
                    {action.icon}
                    <CardTitle className="ml-2 text-sm font-medium">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <CardDescription className="text-xs">{action.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {selectedAction && (
        <div className="mt-4 p-4 border rounded-md relative">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">View all properties</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedAction.title} - All Properties</DialogTitle>
              </DialogHeader>
              {selectedAction.allProperties}
            </DialogContent>
          </Dialog>
          {selectedAction.majorProperties}
        </div>
      )}
    </div>
  )
}

export default ActionSelector

// Example usage and documentation
export const examplesActionSelector: ComponentDoc[] = [
  {
    id: 'ActionSelector',
    name: 'ActionSelector',
    description: 'A component for selecting an action from a list with filtering, search capabilities, and a maximize/restore feature that fills the entire screen.',
    usage: `
import ActionSelector from './ActionSelector'
import { Mail, Settings, User, FileText, Calendar, Bell, Bookmark, Camera, Clipboard, Coffee, Compass, Database, Download, Eye, FilePlus, Folder, Globe, Heart, Image, Key } from 'lucide-react'

const actions: ActionType[] = [
  {
    id: '1',
    icon: <Mail className="h-4 w-4" />,
    title: 'Send Email',
    description: 'Compose and send an email',
    majorProperties: <div>Recipient, Subject, Body</div>,
    allProperties: <div>Recipient, Subject, Body, Attachments, CC, BCC</div>
  },
  // ... (include all 20 actions here)
]

const handleActionSelect = (action: ActionType) => {
  console.log('Selected action:', action)
}

<ActionSelector
  actions={actions}
  onActionSelect={handleActionSelect}
  className="w-full max-w-md"
/>
    `,
    example: (
      <ActionSelector
        actions={[
          {
            id: '1',
            icon: <Mail className="h-4 w-4" />,
            title: 'Send Email',
            description: 'Compose and send an email',
            majorProperties: <div>Recipient, Subject, Body</div>,
            allProperties: <div>Recipient, Subject, Body, Attachments, CC, BCC</div>
          },
          {
            id: '2',
            icon: <Settings className="h-4 w-4" />,
            title: 'Update Settings',
            description: 'Modify application settings',
            majorProperties: <div>Theme, Notifications</div>,
            allProperties: <div>Theme, Notifications, Privacy, Security</div>
          },
          {
            id: '3',
            icon: <User className="h-4 w-4" />,
            title: 'Edit Profile',
            description: 'Update user profile information',
            majorProperties: <div>Name, Email</div>,
            allProperties: <div>Name, Email, Avatar, Bio, Social Links</div>
          },
          {
            id: '4',
            icon: <FileText className="h-4 w-4" />,
            title: 'Create Document',
            description: 'Create a new document',
            majorProperties: <div>Title, Content</div>,
            allProperties: <div>Title, Content, Tags, Collaborators</div>
          },
          {
            id: '5',
            icon: <Calendar className="h-4 w-4" />,
            title: 'Schedule Event',
            description: 'Add a new event to the calendar',
            majorProperties: <div>Date, Time, Title</div>,
            allProperties: <div>Date, Time, Title, Description, Attendees, Location</div>
          },
          {
            id: '6',
            icon: <Bell className="h-4 w-4" />,
            title: 'Set Reminder',
            description: 'Create a new reminder',
            majorProperties: <div>Date, Time, Message</div>,
            allProperties: <div>Date, Time, Message, Repeat, Priority</div>
          },
          {
            id: '7',
            icon: <Bookmark className="h-4 w-4" />,
            title: 'Add Bookmark',
            description: 'Save a new bookmark',
            majorProperties: <div>URL, Title</div>,
            allProperties: <div>URL, Title, Description, Tags, Folder</div>
          },
          {
            id: '8',
            icon: <Camera className="h-4 w-4" />,
            title: 'Take Photo',
            description: 'Capture a new photo',
            majorProperties: <div>Camera, Flash</div>,
            allProperties: <div>Camera, Flash, Resolution, Timer, Filters</div>
          },
          {
            id: '9',
            icon: <ClipboardCopy className="h-4 w-4" />,
            title: 'Create Task',
            description: 'Add a new task to the list',
            majorProperties: <div>Title, Due Date</div>,
            allProperties: <div>Title, Due Date, Description, Priority, Assignee</div>
          },
          {
            id: '10',
            icon: <Coffee className="h-4 w-4" />,
            title: 'Order Coffee',
            description: 'Place a coffee order',
            majorProperties: <div>Type, Size</div>,
            allProperties: <div>Type, Size, Additions, Temperature, Quantity</div>
          },
          {
            id: '11',
            icon: <Compass className="h-4 w-4" />,
            title: 'Get Directions',
            description: 'Find route to a destination',
            majorProperties: <div>Start, Destination</div>,
            allProperties: <div>Start, Destination, Mode of Transport, Waypoints</div>
          },
          {
            id: '12',
            icon: <Database className="h-4 w-4" />,
            title: 'Backup Data',
            description: 'Create a backup of your data',
            majorProperties: <div>Source, Destination</div>,
            allProperties: <div>Source, Destination, Frequency, Encryption</div>
          },
          {
            id: '13',
            icon: <Download className="h-4 w-4" />,
            title: 'Download File',
            description: 'Download a file from the internet',
            majorProperties: <div>URL, Save Location</div>,
            allProperties: <div>URL, Save Location, File Type, Size</div>
          },
          {
            id: '14',
            icon: <Eye className="h-4 w-4" />,
            title: 'Preview Document',
            description: 'View a document without opening it',
            majorProperties: <div>File, View Mode</div>,
            allProperties: <div>File, View Mode, Zoom, Annotations</div>
          },
          {
            id: '15',
            icon: <FilePlus className="h-4 w-4" />,
            title: 'Create New File',
            description: 'Create a new file in the system',
            majorProperties: <div>Name, Type</div>,
            allProperties: <div>Name, Type, Location, Template</div>
          },
          {
            id: '16',
            icon: <Folder className="h-4 w-4" />,
            title: 'Create Folder',
            description: 'Create a new folder',
            majorProperties: <div>Name, Location</div>,
            allProperties: <div>Name, Location, Permissions, Color</div>
          },
          {
            id: '17',
            icon: <Globe className="h-4 w-4" />,
            title: 'Browse Web',
            description: 'Open a new web browsing session',
            majorProperties: <div>URL, Browser</div>,
            allProperties: <div>URL, Browser, Incognito Mode, Bookmarks</div>
          },
          {
            id: '18',
            icon: <Heart className="h-4 w-4" />,
            title: 'Add to Favorites',
            description: 'Add an item to your favorites',
            majorProperties: <div>Item, Category</div>,
            allProperties: <div>Item, Category, Notes, Rating</div>
          },
          {
            id: '19',
            icon: <Image className="h-4 w-4" />,
            title: 'Edit Image',
            description: 'Open image editing interface',
            majorProperties: <div>Image, Tool</div>,
            allProperties: <div>Image, Tool, Filters, Adjustments, Layers</div>
          },
          {
            id: '20',
            icon: <Key className="h-4 w-4" />,
            title: 'Change Password',
            description: 'Update your account password',
            majorProperties: <div>Current, New</div>,
            allProperties: <div>Current, New, Confirm, Strength, Expiry</div>
          }
        ]}
        onActionSelect={(action) => console.log('Selected action:', action)}
        className="w-full max-w-md"
      />
    )
  }
]