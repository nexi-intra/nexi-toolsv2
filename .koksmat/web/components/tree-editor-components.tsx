import React from 'react'
import {
  Folder,
  File,
  FileText,
  FileCode,
  Plus,
  MoreHorizontal,
  Trash2,
  ChevronRight,
  ClipboardCopy,
  ClipboardPaste,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'

// Import the ActionType from the actions-selector file
import { ActionType } from './action-selector'

// Types
export type TreeNode = {
  id: string
  text: string
  translations?: { [key: string]: string }
  icon: 'folder' | 'file' | 'fileText' | 'fileCode'
  children?: TreeNode[]
  action?: ActionType // Add the action attribute
}

export type EditorData = TreeNode[]

export type EditorMode = 'view' | 'edit' | 'reorder'

// Helper function to get the icon component
export const getIcon = (icon: 'folder' | 'file' | 'fileText' | 'fileCode') => {
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

// TreeNodeComponent
export const TreeNodeComponent: React.FC<{
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
  onPromote: () => void
  onDemote: () => void
  isSelected: boolean
  hasChildren: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  path: number[]
  disableMoveUp: boolean
  disableMoveDown: boolean
  disablePromote: boolean
  disableDemote: boolean
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
  onPromote,
  onDemote,
  isSelected,
  hasChildren,
  isCollapsed,
  onToggleCollapse,
  path,
  disableMoveUp,
  disableMoveDown,
  disablePromote,
  disableDemote
}) => {
    const { toast } = useToast()

    const handleAction = (action: string) => {
      toast({ title: `${action} action performed` })
    }

    return (
      <div
        className={`relative group flex items-center p-2 mb-1 rounded-md ${mode === 'edit' ? 'hover:bg-accent' : ''
          } ${isSelected ? 'bg-accent' : ''}`}
        style={{
          paddingLeft: `${depth * 20 + 24}px` // Adjust padding to ensure alignment
        }}
        onDoubleClick={() => mode === 'view' && onToggleCollapse()}
        onClick={onSelectItem}
      >
        <div
          className="absolute left-0"
          style={{
            width: '24px',
            height: '24px',
            left: `${depth * 20}px` // Position the toggle/icon container
          }}
        >
          {hasChildren ? (
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
          ) : (
            <div className="w-6 h-6" /> // Placeholder to maintain alignment
          )}
        </div>
        {getIcon(node.icon)}
        <span className="flex-grow">{node.text}</span>
        {mode !== 'view' && (
          <div
            className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-2
          bg-white dark:bg-gray-800 p-1 rounded-md shadow-md"
          >
            {mode === 'edit' &&
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddItem()
                        handleAction('Add')
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Item</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteItem()
                        handleAction('Delete')
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Item</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCopyItem()
                        handleAction('Copy')
                      }}
                    >
                      <ClipboardCopy className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Item</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPasteItem()
                        handleAction('Paste')
                      }}
                    >
                      <ClipboardPaste className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paste Item</TooltipContent>
                </Tooltip>
              </>
            }
            {mode === 'reorder' &&
              <>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onPromote()
                        handleAction('Promote')
                      }}
                      disabled={disablePromote}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Promote</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDemote()
                        handleAction('Demote')
                      }}
                      disabled={disableDemote}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Demote</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveUp()
                        handleAction('Move Up')
                      }}
                      disabled={disableMoveUp}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move Up</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveDown()
                        handleAction('Move Down')
                      }}
                      disabled={disableMoveDown}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move Down</TooltipContent>
                </Tooltip>
              </>
            }
            {mode === 'edit' &&
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectItem()
                      handleAction('Properties')
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Properties</TooltipContent>
              </Tooltip>}
          </div>
        )}
      </div>
    )
  }
// Custom hook for undo/redo functionality
export const useUndoRedo = (initialState: EditorData) => {
  const [currentState, setCurrentState] = React.useState(initialState)
  const [pastStates, setPastStates] = React.useState<EditorData[]>([])
  const [futureStates, setFutureStates] = React.useState<EditorData[]>([])

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  const undo = React.useCallback(() => {
    if (canUndo) {
      const previous = pastStates[pastStates.length - 1]
      const newPast = pastStates.slice(0, pastStates.length - 1)
      setPastStates(newPast)
      setFutureStates([currentState, ...futureStates])
      setCurrentState(previous)
    }
  }, [canUndo, currentState, pastStates, futureStates])

  const redo = React.useCallback(() => {
    if (canRedo) {
      const next = futureStates[0]
      const newFuture = futureStates.slice(1)
      setFutureStates(newFuture)
      setPastStates([...pastStates, currentState])
      setCurrentState(next)
    }
  }, [canRedo, currentState, pastStates, futureStates])

  const updateState = React.useCallback(
    (newState: EditorData) => {
      setPastStates([...pastStates, currentState])
      setCurrentState(newState)
      setFutureStates([])
    },
    [currentState, pastStates]
  )

  return { currentState, updateState, undo, redo, canUndo, canRedo }
}