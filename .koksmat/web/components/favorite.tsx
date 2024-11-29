'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { ComponentDoc } from './component-documentation-hub'
import { databaseActions } from '@/app/tools/schemas/database'
import { useKoksmatDatabase } from '@/app/koksmat/src/v.next/components/database-context-provider'
import { kError, kVerbose } from '@/lib/koksmat-logger-client'

/**
 * Favorite Component
 * 
 * This component allows users to mark an item as a favorite. It supports view, new, and edit modes.
 * The component uses a star icon to represent the favorite status and can be customized with additional classes.
 * 
 * @param {Object} props - The properties passed to the component
 * @param {boolean} props.defaultIsFavorite - The initial favorite state
 * @param {string} props.mode - The mode of the component: 'view', 'new', or 'edit'
 * @param {function} props.onChange - Callback function called when the favorite state changes
 * @param {string} props.className - Additional CSS classes to apply to the component
 */
export interface FavoriteProps {
  defaultIsFavorite: boolean
  mode: 'view' | 'new' | 'edit'
  onChange?: (isFavorite: boolean) => void
  className?: string,
  tool_id?: number,
  email?: string,
}

export function FavoriteComponent({
  defaultIsFavorite = false,
  mode = 'view',
  onChange,
  className = '',
  tool_id,
  email
}: FavoriteProps) {
  const [isFavorite, setIsFavorite] = useState(defaultIsFavorite)
  const actionName = "userprofileFavourite"
  const action = databaseActions.getAction(actionName)
  const table = useKoksmatDatabase().table("", action!.databaseName, action!.inputSchema)

  // Update local state if prop changes
  useEffect(() => {
    setIsFavorite(defaultIsFavorite)
  }, [defaultIsFavorite])

  const handleToggle = async () => {
    if (mode !== 'view') {
      const newState = !isFavorite
      try {
        if (email && tool_id) {
          const data = {
            email, tool_id, is_favorite: newState
          }
          kVerbose("component", "FavoriteComponent onSave", data, mode);
          const writeOperation = await table.execute(actionName, data)
          kVerbose("component", "FavoriteComponent onSave completed", writeOperation);
        }
        setIsFavorite(newState)
        onChange?.(newState);

      } catch (error) {
        kError("component", "onSave", error)
      }
    }
  }

  // Determine the star color based on the favorite state and mode
  const starColor = isFavorite ? 'text-yellow-400' : 'text-gray-400'
  const isInteractive = mode !== 'view'

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Star
        className={`w-6 h-6 ${starColor} ${isInteractive ? 'cursor-pointer hover:text-yellow-500' : ''
          } transition-colors duration-200`}
        fill={isFavorite ? 'currentColor' : 'none'}
        onClick={handleToggle}
        role={isInteractive ? 'button' : 'presentation'}
        aria-label={isInteractive ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Favorite status'}
        tabIndex={isInteractive ? 0 : -1}
      />
    </div>
  )
}

// Example usage documentation
export const examplesFavorite: ComponentDoc[] = [
  {
    id: 'FavoriteView',
    name: 'Favorite (View Mode)',
    description: 'A component for displaying favorite status in view mode.',
    usage: `
<Favorite
  defaultIsFavorite={true}
  mode="view"
  onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
/>
    `,
    example: (
      <FavoriteComponent
        defaultIsFavorite={true}
        mode="view"
        onChange={(isFavorite) => console.log(isFavorite)}
      />
    ),
  },
  {
    id: 'FavoriteNew',
    name: 'Favorite (New Mode)',
    description: 'A component for setting favorite status in new mode.',
    usage: `
<Favorite
  defaultIsFavorite={false}
  mode="new"
  onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
/>
    `,
    example: (
      <FavoriteComponent
        defaultIsFavorite={false}
        mode="new"
        onChange={(isFavorite) => console.log(isFavorite)}
      />
    ),
  },
  {
    id: 'FavoriteEdit',
    name: 'Favorite (Edit Mode)',
    description: 'A component for editing favorite status in edit mode.',
    usage: `
<Favorite
  defaultIsFavorite={true}
  mode="edit"
  onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
  className="bg-gray-100 p-2 rounded"
/>
    `,
    example: (
      <FavoriteComponent
        defaultIsFavorite={true}
        mode="edit"
        onChange={(isFavorite) => console.log(isFavorite)}
        className="bg-gray-100 p-2 rounded"
      />
    ),
  },
]