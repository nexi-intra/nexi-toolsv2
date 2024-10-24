'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { ComponentDoc } from './component-documentation-hub'

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
  onChange: (mode: 'view' | 'new' | 'edit', isFavorite: boolean) => void
  className?: string
}

export function FavoriteComponent({
  defaultIsFavorite = false,
  mode = 'view',
  onChange,
  className = '',
}: FavoriteProps) {
  const [isFavorite, setIsFavorite] = useState(defaultIsFavorite)

  // Update local state if prop changes
  useEffect(() => {
    setIsFavorite(defaultIsFavorite)
  }, [defaultIsFavorite])

  const handleToggle = () => {
    if (mode !== 'view') {
      const newState = !isFavorite
      setIsFavorite(newState)
      onChange(mode, newState)
    }
  }

  // Determine the star color based on the favorite state and mode
  const starColor = isFavorite ? 'text-yellow-400' : 'text-gray-400'
  const isInteractive = mode !== 'view'

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Star
        className={`w-6 h-6 ${starColor} ${
          isInteractive ? 'cursor-pointer hover:text-yellow-500' : ''
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
        onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
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
        onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
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
        onChange={(mode, isFavorite) => console.log(mode, isFavorite)}
        className="bg-gray-100 p-2 rounded"
      />
    ),
  },
]