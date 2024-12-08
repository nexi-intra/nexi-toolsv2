'use client'

import { DragDropEditor, Grid } from '@/components/dnd';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Home() {
  const [isEditMode, setIsEditMode] = useState(true);
  const [data, setdata] = useState<any>()


  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drag and Drop Editor</h1>
      <Button onClick={() => setIsEditMode(!isEditMode)} className="mb-4">
        {isEditMode ? 'View Mode' : 'Edit Mode'}
      </Button>
      <DragDropEditor isEditMode={isEditMode} onSave={function (args_0: { columns: { id: string; title: string; }[]; rows: { id: string; cells: { id: string; components: { id: string; content: string; }[]; }[]; }[]; }, ...args: unknown[]): void {
        setdata({
          columns: args_0.columns,
          rows: args_0.rows
        })

      }} />
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}

