'use client';

import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Plus, ChevronDown, Search } from 'lucide-react';
import clsx from 'clsx';

// Define the IdValue interface
export interface IdValue {
  id: number;
  value: string;
  sortorder: string; // Sorting will be done based on this field
}

// Define the ComponentDoc interface
export interface ComponentDoc {
  id: string;
  name: string;
  description: string;
  usage: string;
  example: JSX.Element;
}

// Component Props
interface LookupProps {
  items: IdValue[]; // Available items to select from
  initialSelectedItems?: IdValue[]; // Initially selected items
  allowMulti?: boolean; // Allow multiple selections or not
  required?: boolean; // At least one item should be selected
  mode?: 'view' | 'edit' | 'new'; // Display mode of the component
  canAddNewItems?: boolean; // Can new items be added
  className?: string; // Additional CSS classes
  renderItem?: (item: IdValue, isSelected: boolean) => React.ReactNode; // Optional custom render function for each item
  onChange?: (selectedItems: IdValue[]) => void; // Callback when selected items change
}

const Lookup: React.FC<LookupProps> = ({
  items,
  initialSelectedItems = [],
  allowMulti = true,
  required = false,
  mode = 'edit',
  canAddNewItems = true,
  className = '',
  renderItem,
  onChange,
}) => {
  // State for selected items
  const [selectedItems, setSelectedItems] = useState<IdValue[]>(initialSelectedItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered and sorted items based on search query and sort order
  const filteredItems = items
    .filter(item => item.value.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.sortorder.localeCompare(b.sortorder, undefined, { numeric: true }));

  // Effect to call onChange when selectedItems change
  useEffect(() => {
    onChange?.(selectedItems);
  }, [selectedItems, onChange]);

  // Function to toggle item selection
  const toggleItem = (item: IdValue) => {
    if (mode === 'view') return; // Prevent editing in view mode

    if (selectedItems.find(i => i.id === item.id)) {
      // Remove item if it exists
      if (required && selectedItems.length === 1) {
        setError('At least one item must be selected.');
        return;
      }
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      // Add item if it doesn't exist
      if (!allowMulti) {
        setSelectedItems([item]); // Replace with a single item if allowMulti is false
      } else {
        setSelectedItems(prev => [...prev, item]);
      }
    }
    setError(null);
  };

  // Function to add a new item
  const addNewItem = () => {
    const newItemValue = searchQuery.trim();
    if (newItemValue === '' || items.find(item => item.value === newItemValue)) return;

    const newItem: IdValue = {
      id: -(items.length + 1), // Generate a unique ID
      value: newItemValue,
      sortorder: (items.length + 1).toString(), // Default sort order for new items
    };

    // Update items list and select the new item
    items.push(newItem);
    setSelectedItems(prev => [...prev, newItem]);
    setSearchQuery('');
  };

  // Helper to render an item, with support for a custom renderer and a clickable overlay
  const renderDefaultItem = (item: IdValue, isSelected: boolean) => (
    <div
      key={item.id}
      className="relative flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => toggleItem(item)}
    >
      <div>{item.value}</div>
      {isSelected && <X size={16} className="text-red-500" />}
    </div>
  );

  // Function to render an item with an overlay for clicking
  const renderItemWithOverlay = (item: IdValue, isSelected: boolean) => (
    <div key={item.id} className="relative">
      {/* Render the custom item */}
      {renderItem ? renderItem(item, isSelected) : renderDefaultItem(item, isSelected)}

      {/* Overlay to capture clicks */}
      {mode !== 'view' && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => toggleItem(item)}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </div>
  );

  // Determine if the current mode allows editing
  const isEditable = mode === 'edit' || mode === 'new';

  return (
    <div className={clsx('w-full', className)}>
      {/* Selected Items Display */}
      <div className="flex items-center gap-2 mb-2">
        {selectedItems.length > 0 ? (
          selectedItems
            .sort((a, b) => a.sortorder.localeCompare(b.sortorder, undefined, { numeric: true })) // Sort selected items
            .map(item => renderItemWithOverlay(item, true))
        ) : (
          isEditable && (
            <span className="text-gray-500">
              {allowMulti ? 'Add items' : 'Add item'}
            </span>
          )
        )}

        {/* Edit Button as ChevronDown */}
        {isEditable && (
          <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center">
                <ChevronDown className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              {/* Search Input */}
              <div className="flex items-center mb-2">
                <Search className="mr-2 h-4 w-4" />
                <Input
                  placeholder="Search or add new item"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                {canAddNewItems && (
                  <Button variant="ghost" onClick={addNewItem} disabled={!searchQuery.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Items List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredItems.map(item => renderItemWithOverlay(item, selectedItems.some(i => i.id === item.id)))}
                {filteredItems.length === 0 && (
                  <p className="text-gray-500 text-sm">No items found.</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Error Message if required */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Lookup;

// Example Configurations
export const examplesKeyValueSelector: ComponentDoc[] = [
  {
    id: 'Lookup-SingleSelect-Required-Edit',
    name: 'Lookup (Single Select, Required, Edit Mode)',
    description: 'A component for selecting a single required key-value pair in edit mode using a tagging approach, respecting sort order.',
    usage: `
import Lookup from './Lookup';

const items = [
  { id: 'option1', value: 'Option 1', sortorder: '2' },
  { id: 'option2', value: 'Option 2', sortorder: '1' },
  { id: 'option3', value: 'Option 3', sortorder: '3' },
];

<Lookup
  items={items}
  mode="edit"
  allowMulti={false}
  required={true}
  initialSelectedItems={[{ id: 'option1', value: 'Option 1', sortorder: '2' }]}
  onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
/>
    `,
    example: (
      <Lookup
        items={[
          { id: 1, value: 'Option 1', sortorder: '2' },
          { id: 2, value: 'Option 2', sortorder: '1' },
          { id: 3, value: 'Option 3', sortorder: '3' },
        ]}
        mode="edit"
        allowMulti={false}
        required={true}
        initialSelectedItems={[{ id: 1, value: 'Option 1', sortorder: '2' }]}
        onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
      />
    ),
  },
  {
    id: 'Lookup-MultiSelect-Optional-Edit',
    name: 'Lookup (Multi Select, Optional, Edit Mode)',
    description: 'A component for selecting multiple optional key-value pairs in edit mode, with sorting applied by sort order.',
    usage: `
import Lookup from './Lookup';

const items = [
          { id: 1, value: 'Option 1', sortorder: '2' },
          { id: 2, value: 'Option 2', sortorder: '1' },
          { id: 3, value: 'Option 3', sortorder: '3' },

];

<Lookup
  items={items}
  mode="edit"
  allowMulti={true}
  required={false}
  initialSelectedItems={[{ id: 2, value: 'Item 2', sortorder: '1' }]}
  onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
/>
    `,
    example: (
      <Lookup
        items={[
          { id: 1, value: 'Item 1', sortorder: '3' },
          { id: 2, value: 'Item 2', sortorder: '1' },
          { id: 3, value: 'Item 3', sortorder: '2' },
        ]}
        mode="edit"
        allowMulti={true}
        required={false}
        initialSelectedItems={[{ id: 2, value: 'Item 2', sortorder: '1' }]}
        onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
      />
    ),
  },
  {
    id: 'Lookup-SingleSelect-Optional-View',
    name: 'Lookup (Single Select, Optional, View Mode)',
    description: 'A component for displaying a single optional key-value pair in view mode, with sorting by sort order.',
    usage: `
import Lookup from './Lookup';

const items = [
  { id: 1, value: 'View 1', sortorder: '1' },
  { id: 2, value: 'View 2', sortorder: '2' },
];

<Lookup
  items={items}
  mode="view"
  allowMulti={false}
  required={false}
  initialSelectedItems={[{ id: 'view1', value: 'View 1', sortorder: '1' }]}
  onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
/>
    `,
    example: (
      <Lookup
        items={[
          { id: 1, value: 'View 1', sortorder: '1' },
          { id: 2, value: 'View 2', sortorder: '2' },
        ]}
        mode="view"
        allowMulti={false}
        required={false}
        initialSelectedItems={[{ id: 1, value: 'View 1', sortorder: '1' }]}
        onChange={(selectedItems) => console.log('Selected Items:', selectedItems)}
      />
    ),
  },
];
