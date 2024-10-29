'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { ChevronDown, MoreVertical, Search, Mail, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComponentDoc } from './component-documentation-hub'

type ActionPropertyData = Record<string, any>

interface ActionPropertyEditorProps {
  mode: 'view' | 'edit'
  hideProperties: boolean
  properties: ActionPropertyData
  onUpdateProperties: (updatedProperties: ActionPropertyData) => void
}

const ActionPropertyEditor: React.FC<ActionPropertyEditorProps> = ({
  mode,
  hideProperties,
  properties,
  onUpdateProperties
}) => {
  if (hideProperties) return null

  return (
    <div className="space-y-4">
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <label htmlFor={key} className="w-1/3 text-sm font-medium">{key}:</label>
          {mode === 'view' ? (
            <span className="w-2/3">{String(value)}</span>
          ) : (
            <Input
              id={key}
              value={String(value)}
              onChange={(e) => onUpdateProperties({ ...properties, [key]: e.target.value })}
              className="w-2/3"
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface ActionType {
  id: string
  icon: JSX.Element
  title: string
  description: string
  actionType: string
  properties: ActionPropertyData
  propertyEditor: React.FC<ActionPropertyEditorProps>
}

interface ActionSelectorProps {
  actions: ActionType[]
  onActionSelect: (action: ActionType) => void
  onUpdateProperties: (actionId: string, updatedProperties: ActionPropertyData) => void
  className?: string
  defaultAction?: ActionType
}

const ActionSelector: React.FC<ActionSelectorProps> = ({
  actions,
  onActionSelect,
  onUpdateProperties,
  className = '',
  defaultAction
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | undefined>(defaultAction)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editMode, setEditMode] = useState(false)

  const handleActionSelect = useCallback((action: ActionType) => {
    setSelectedAction(action)
    onActionSelect(action)
    setIsOpen(false)
    setEditMode(false)
  }, [onActionSelect])

  const handleUpdateProperties = useCallback((updatedProperties: ActionPropertyData) => {
    if (selectedAction) {
      onUpdateProperties(selectedAction.id, updatedProperties)
    }
  }, [selectedAction, onUpdateProperties])

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      return action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [actions, searchTerm])

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
        <PopoverContent className="w-[300px] p-0">
          <div className="p-2 space-y-2">
            <Input
              type="search"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <div className="max-h-[300px] overflow-y-auto">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedAction.title}</h3>
            <div>
              <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} className="mr-2">
                {editMode ? 'View' : 'Edit'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">View all properties</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedAction.title} - All Properties</DialogTitle>
                  </DialogHeader>
                  <selectedAction.propertyEditor
                    mode="view"
                    hideProperties={false}
                    properties={selectedAction.properties}
                    onUpdateProperties={handleUpdateProperties}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <selectedAction.propertyEditor
            mode={editMode ? 'edit' : 'view'}
            hideProperties={false}
            properties={selectedAction.properties}
            onUpdateProperties={handleUpdateProperties}
          />
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
    description: 'A component for selecting an action from a list with search capabilities and property editing.',
    usage: `
import ActionSelector from './ActionSelector'
import { Mail, Settings, User } from 'lucide-react'

const actions: ActionType[] = [
  {
    id: '1',
    icon: <Mail className="h-4 w-4" />,
    title: 'Send Email',
    description: 'Compose and send an email',
    actionType: 'send_email',
    properties: {
      recipient: '',
      subject: '',
      body: ''
    },
    propertyEditor: ActionPropertyEditor
  },
  // ... (include more actions here)
]

const handleActionSelect = (action: ActionType) => {
  console.log('Selected action:', action)
}

const handleUpdateProperties = (actionId: string, updatedProperties: ActionPropertyData) => {
  console.log('Updated properties for action', actionId, ':', updatedProperties)
}

<ActionSelector
  actions={actions}
  onActionSelect={handleActionSelect}
  onUpdateProperties={handleUpdateProperties}
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
            actionType: 'send_email',
            properties: {
              recipient: '',
              subject: '',
              body: ''
            },
            propertyEditor: ActionPropertyEditor
          },
          {
            id: '2',
            icon: <Settings className="h-4 w-4" />,
            title: 'Update Settings',
            description: 'Modify application settings',
            actionType: 'update_settings',
            properties: {
              theme: 'light',
              notifications: true
            },
            propertyEditor: ActionPropertyEditor
          },
          {
            id: '3',
            icon: <User className="h-4 w-4" />,
            title: 'Edit Profile',
            description: 'Update user profile information',
            actionType: 'edit_profile',
            properties: {
              name: '',
              email: '',
              bio: ''
            },
            propertyEditor: ActionPropertyEditor
          }
        ]}
        onActionSelect={(action) => console.log('Selected action:', action)}
        onUpdateProperties={(actionId, updatedProperties) => console.log('Updated properties for action', actionId, ':', updatedProperties)}
        className="w-full max-w-md"
      />
    )
  }
]