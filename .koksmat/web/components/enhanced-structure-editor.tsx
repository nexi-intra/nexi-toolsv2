'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { nanoid } from 'nanoid'
import {
  Folder,
  File,
  FileText,
  FileCode,
  Undo,
  Redo,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  PlusCircle,
  Trash2,
  X,
  ChevronRight,
  ClipboardCopy,
  ClipboardPaste,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type TreeNode = {
  id: string
  text: string
  icon: 'folder' | 'file' | 'fileText' | 'fileCode'
  children?: TreeNode[]
}

type EditorData = TreeNode[]

type EditorMode = 'view' | 'edit' | 'new'

const useUndoRedo = (initialState: EditorData) => {
  const [currentState, setCurrentState] = useState(initialState)
  const [pastStates, setPastStates] = useState<EditorData[]>([])
  const [futureStates, setFutureStates] = useState<EditorData[]>([])

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  const undo = useCallback(() => {
    if (canUndo) {
      const previous = pastStates[pastStates.length - 1]
      const newPast = pastStates.slice(0, pastStates.length - 1)
      setPastStates(newPast)
      setFutureStates([currentState, ...futureStates])
      setCurrentState(previous)
    }
  }, [canUndo, currentState, pastStates, futureStates])

  const redo = useCallback(() => {
    if (canRedo) {
      const next = futureStates[0]
      const newFuture = futureStates.slice(1)
      setFutureStates(newFuture)
      setPastStates([...pastStates, currentState])
      setCurrentState(next)
    }
  }, [canRedo, currentState, pastStates, futureStates])

  const updateState = useCallback(
    (newState: EditorData) => {
      setPastStates([...pastStates, currentState])
      setCurrentState(newState)
      setFutureStates([])
    },
    [currentState, pastStates]
  )

  return { currentState, updateState, undo, redo, canUndo, canRedo }
}

const getIcon = (icon: 'folder' | 'file' | 'fileText' | 'fileCode') => {
  switch (icon) {
    case 'folder':
      return <Folder className="w-4 h-4 mr-2" />
    case 'file':
      return <File className="w-4 h-4 mr-2" />
    case 'fileText':
      return <FileText className="w-4 h-4 mr-2" />
    case 'fileCode':
      return <FileCode className="w-4 h-4 mr-2" />
  }
}

const TreeNodeComponent: React.FC<{
  node: TreeNode
  depth: number
  mode: EditorMode
  onAddItem: () => void
  onDeleteItem: () => void
  onSelectItem: () => void
  onCopyItem: () => void
  onPasteItem: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isSelected: boolean
  hasChildren: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  path: number[]
}> = ({
  node,
  depth,
  mode,
  onAddItem,
  onDeleteItem,
  onSelectItem,
  onCopyItem,
  onPasteItem,
  onMoveUp,
  onMoveDown,
  isSelected,
  hasChildren,
  isCollapsed,
  onToggleCollapse,
  path
}) => (
    <div
      className={`relative group flex items-center p-2 mb-1 rounded-md ${mode === 'edit' ? 'hover:bg-accent' : ''
        } ${isSelected ? 'bg-accent' : ''}`}
      style={{
        marginLeft: `${depth * 20}px`
      }}
      onDoubleClick={() => mode === 'view' && onToggleCollapse()}
      onClick={onSelectItem}
    >
      {hasChildren && (
        <Button
          variant="ghost"
          size="icon"
          className="p-0 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation()
            onToggleCollapse()
          }}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'
              }`}
          />
        </Button>
      )}
      {getIcon(node.icon)}
      <span className="flex-grow">{node.text}</span>
      {mode !== 'view' && (
        <div
          className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-2
        bg-white dark:bg-gray-800 p-1 rounded-md shadow-md"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onAddItem()
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteItem()
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onCopyItem()
            }}
          >
            <ClipboardCopy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onPasteItem()
            }}
          >
            <ClipboardPaste className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp()
            }}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown()
            }}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      )}
      {mode !== 'view' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onSelectItem()
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      )}
    </div>
  )


const StructureEditor: React.FC<{
  initialData: EditorData
  onChange: (data: EditorData) => void
  className?: string
}> = ({ initialData, onChange, className = '' }) => {
  const { currentState, updateState, undo, redo, canUndo, canRedo } =
    useUndoRedo(initialData)
  const [mode, setMode] = useState<EditorMode>('view')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number[] | null>(null)
  const [dontPromptDelete, setDontPromptDelete] = useState(false)
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false)
  const [collapsedItems, setCollapsedItems] = useState<Set<string>>(new Set())
  const [copiedNode, setCopiedNode] = useState<TreeNode | null>(null)

  useEffect(() => {
    onChange(currentState)
  }, [currentState, onChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'view') {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault()
          if (e.shiftKey) {
            redo()
          } else {
            undo()
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault()
          redo()
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
          e.preventDefault()
          if (selectedItem) {
            const node = findItemById(currentState, selectedItem)
            if (node) {
              setCopiedNode(JSON.parse(JSON.stringify(node)))
            }
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
          e.preventDefault()
          if (copiedNode) {
            pasteItem()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode, undo, redo, selectedItem, currentState, copiedNode])

  const findItemById = (items: TreeNode[], id: string): TreeNode | null => {
    for (let item of items) {
      if (item.id === id) {
        return item
      }
      if (item.children) {
        const found = findItemById(item.children, id)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  const findItemPathById = (
    items: TreeNode[],
    id: string,
    path: number[] = []
  ): number[] | null => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.id === id) {
        return [...path, i]
      }
      if (item.children) {
        const found = findItemPathById(item.children, id, [...path, i])
        if (found) {
          return found
        }
      }
    }
    return null
  }

  const addItem = useCallback(
    (path: number[]) => {
      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData
      let currentLevel: TreeNode[] = newData

      for (let i = 0; i < path.length; i++) {
        if (!currentLevel[path[i]].children) {
          currentLevel[path[i]].children = []
        }
        currentLevel = currentLevel[path[i]].children!
      }

      const newItem: TreeNode = {
        id: nanoid(),
        text: 'New Item',
        icon: 'file',
        children: []
      }
      currentLevel.push(newItem)

      updateState(newData)
    },
    [currentState, updateState]
  )

  const deleteItem = useCallback(
    (path: number[]) => {
      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData
      let currentLevel: TreeNode[] = newData

      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]].children!
      }

      currentLevel.splice(path[path.length - 1], 1)

      updateState(newData)
      setSelectedItem(null)
      setPropertiesPanelOpen(false)
    },
    [currentState, updateState]
  )

  const handleDeleteItem = useCallback(
    (path: number[]) => {
      if (dontPromptDelete) {
        deleteItem(path)
      } else {
        setItemToDelete(path)
        setDeleteConfirmOpen(true)
      }
    },
    [dontPromptDelete, deleteItem]
  )

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteItem(itemToDelete)
      setDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }, [itemToDelete, deleteItem])

  const copyItem = useCallback(
    (id: string) => {
      const node = findItemById(currentState, id)
      if (node) {
        setCopiedNode(JSON.parse(JSON.stringify(node)))
      }
    },
    [currentState]
  )

  const pasteItem = useCallback(() => {
    if (copiedNode && selectedItem) {
      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData
      const path = findItemPathById(newData, selectedItem)
      if (path) {
        let currentLevel: TreeNode[] = newData

        for (let i = 0; i < path.length; i++) {
          if (!currentLevel[path[i]].children) {
            currentLevel[path[i]].children = []
          }
          currentLevel = currentLevel[path[i]].children!
        }

        const newNode = JSON.parse(JSON.stringify(copiedNode))
        newNode.id = nanoid()
        assignNewIds(newNode)
        currentLevel.push(newNode)

        updateState(newData)
      }
    }
  }, [copiedNode, selectedItem, currentState, updateState])

  const assignNewIds = (node: TreeNode) => {
    node.id = nanoid()
    if (node.children) {
      node.children.forEach(assignNewIds)
    }
  }

  const moveItemUp = useCallback(
    (path: number[]) => {
      if (path.length === 0 || path[path.length - 1] === 0) return
      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData
      let currentLevel: TreeNode[] = newData

      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]].children!
      }

      const index = path[path.length - 1]
      const temp = currentLevel[index - 1]
      currentLevel[index - 1] = currentLevel[index]
      currentLevel[index] = temp

      updateState(newData)
      setSelectedItem(currentLevel[index - 1].id)
    },
    [currentState, updateState]
  )

  const moveItemDown = useCallback(
    (path: number[]) => {
      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData
      let currentLevel: TreeNode[] = newData

      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]].children!
      }

      const index = path[path.length - 1]
      if (index >= currentLevel.length - 1) return

      const temp = currentLevel[index + 1]
      currentLevel[index + 1] = currentLevel[index]
      currentLevel[index] = temp

      updateState(newData)
      setSelectedItem(currentLevel[index + 1].id)
    },
    [currentState, updateState]
  )

  const renderItems = useCallback(
    (items: TreeNode[], path: number[] = []) => {
      return items.map((item, index) => {
        const currentPath = [...path, index]
        const isCollapsed = collapsedItems.has(item.id)
        const hasChildren = item.children && item.children.length > 0

        return (
          <React.Fragment key={item.id}>
            <TreeNodeComponent
              node={item}
              depth={currentPath.length - 1}
              mode={mode}
              onAddItem={() => addItem(currentPath)}
              onDeleteItem={() => handleDeleteItem(currentPath)}
              onSelectItem={() => {
                setSelectedItem(item.id)
                setPropertiesPanelOpen(true)
              }}
              onCopyItem={() => copyItem(item.id)}
              onPasteItem={() => {
                setSelectedItem(item.id)
                pasteItem()
              }}
              onMoveUp={() => moveItemUp(currentPath)}
              onMoveDown={() => moveItemDown(currentPath)}
              isSelected={selectedItem === item.id}
              hasChildren={!!hasChildren}
              isCollapsed={isCollapsed}
              onToggleCollapse={() => {
                setCollapsedItems((prev) => {
                  const newSet = new Set(prev)
                  if (newSet.has(item.id)) {
                    newSet.delete(item.id)
                  } else {
                    newSet.add(item.id)
                  }
                  return newSet
                })
              }}
              path={currentPath}
            />
            {hasChildren && !isCollapsed && (
              <div>{renderItems(item.children!, currentPath)}</div>
            )}
          </React.Fragment>
        )
      })
    },
    [
      mode,
      addItem,
      handleDeleteItem,
      selectedItem,
      collapsedItems,
      copyItem,
      pasteItem,
      moveItemUp,
      moveItemDown
    ]
  )

  const updateItemProperty = useCallback(
    (property: string, value: string) => {
      if (!selectedItem) return

      const newData = JSON.parse(JSON.stringify(currentState)) as EditorData

      const updateItem = (items: TreeNode[]): boolean => {
        for (let item of items) {
          if (item.id === selectedItem) {
            // @ts-ignore
            item[property] = value
            return true
          }
          if (item.children && updateItem(item.children)) {
            return true
          }
        }
        return false
      }

      updateItem(newData)
      updateState(newData)
    },
    [currentState, updateState, selectedItem]
  )

  const selectedItemData = selectedItem
    ? findItemById(currentState, selectedItem)
    : null

  return (
    <Card className={`w-full max-w-5xl mx-auto ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <Select
            value={mode}
            onValueChange={(value: EditorMode) => setMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </div>
              </SelectItem>
              <SelectItem value="edit">
                <div className="flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </div>
              </SelectItem>
              <SelectItem value="new">
                <div className="flex items-center">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button
              onClick={undo}
              disabled={!canUndo || mode === 'view'}
              size="sm"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              onClick={redo}
              disabled={!canRedo || mode === 'view'}
              size="sm"
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </div>
        </div>
        <div className="flex">
          <div className="flex-grow overflow-auto max-h-[600px]">
            {currentState.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="mb-4 text-gray-500">No items to display.</p>
                {mode !== 'view' && (
                  <Button onClick={() => addItem([])}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Root Item
                  </Button>
                )}
              </div>
            ) : (
              <div>{renderItems(currentState)}</div>
            )}
            {mode === 'new' && currentState.length > 0 && (
              <Button onClick={() => addItem([])} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Root Item
              </Button>
            )}
          </div>
          {propertiesPanelOpen && selectedItemData && (
            <Card className="w-64 ml-4 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Properties</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPropertiesPanelOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Name</Label>
                  <Input
                    id="itemName"
                    value={selectedItemData.text}
                    onChange={(e) =>
                      updateItemProperty('text', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="itemIcon">Icon</Label>
                  <Select
                    value={selectedItemData.icon || 'file'}
                    onValueChange={(
                      value: 'folder' | 'file' | 'fileText' | 'fileCode'
                    ) => updateItemProperty('icon', value)}
                  >
                    <SelectTrigger id="itemIcon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folder">Folder</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="fileText">File Text</SelectItem>
                      <SelectItem value="fileCode">File Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>
      </CardContent>
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dontPrompt"
                checked={dontPromptDelete}
                onCheckedChange={(checked) =>
                  setDontPromptDelete(checked as boolean)
                }
              />
              <label
                htmlFor="dontPrompt"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Don&apos;t ask again this session
              </label>
            </div>
          </DialogFooter>
          <DialogFooter>
            <Button type="submit" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Example data
const exampleData: EditorData = [
  {
    id: nanoid(),
    text: 'Our Group',
    icon: 'folder',
    children: [
      {
        id: nanoid(),
        text: 'About us',
        icon: 'file',
        children: [
          {
            id: nanoid(),
            text: 'Strategic positioning, ambition & purpose',
            icon: 'fileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Facts & Figures',
            icon: 'fileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Values & Behaviours',
            icon: 'fileText',
            children: []
          }
        ]
      },
      {
        id: nanoid(),
        text: 'New@Nexi: Onboarding Guides',
        icon: 'file',
        children: []
      }
    ]
  },
  {
    id: nanoid(),
    text: 'Our Organisation',
    icon: 'folder',
    children: [
      {
        id: nanoid(),
        text: 'Brand Identity',
        icon: 'file',
        children: [
          {
            id: nanoid(),
            text: 'Logos & Rules',
            icon: 'fileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Web & Social Media',
            icon: 'fileText',
            children: []
          },
          {
            id: nanoid(),
            text: 'Brand materials & templates',
            icon: 'fileText',
            children: []
          }
        ]
      },
      {
        id: nanoid(),
        text: 'DEI',
        icon: 'file',
        children: []
      },
      {
        id: nanoid(),
        text: 'ESG',
        icon: 'file',
        children: []
      }
    ]
  },
  {
    id: nanoid(),
    text: 'Countries',
    icon: 'folder',
    children: [
      {
        id: nanoid(),
        text: 'DACH',
        icon: 'file',
        children: []
      }
    ]
  }
]

// Export the component
export default function Component() {
  return (
    <StructureEditor
      initialData={exampleData}
      onChange={(data) => console.log('Structure updated:', data)}
    />
  )
}
