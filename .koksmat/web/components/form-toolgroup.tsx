"use client"

import { databases } from '@/app/tools/api/database'
import SchemaForm from '@/components/schema-form'
import { Button } from '@/components/ui/button'
import { kInfo } from '@/lib/koksmat-logger-client'
import React, { useState } from 'react'

export default function ToolGroupEditor() {

  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('view')
  const [data, setData] = useState<databases.tools.Toolgroup>()
  const [isValid, setisValid] = useState(false)
  const [errors, seterrors] = useState<Array<{ field: string; message: string }>>([])

  const handleChange = (isValid: boolean, newData: databases.tools.Toolgroup, errors: Array<{ field: string; message: string }>) => {
    setData(newData)
    setisValid(isValid)
    seterrors(errors)
    kInfo(`Data updated in ${mode} mode:`, { isValid, data: newData, errors })
  }

  return (
    <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg w-full">
      <div className="space-x-2">
        <Button onClick={() => setMode('view')} variant={mode === 'view' ? 'default' : 'outline'}>View</Button>
        <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'default' : 'outline'}>Edit</Button>
        <Button onClick={() => setMode('new')} variant={mode === 'new' ? 'default' : 'outline'}>New</Button>
        <Button variant={"secondary"} onClick={() => alert("saving")}> Save</Button>
      </div>
      <SchemaForm
        schema={databases.tools.table.toolgroup.schema}
        initialData={data}
        mode={mode}
        onChange={handleChange}
        omit={['tenant', 'searchindex']}
      />
      <div className="mt-4">
        {!isValid && (

          <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(errors, null, 2)}
          </pre>)}
        <h3 className="text-lg font-semibold text-black dark:text-white">Resulting JSON:</h3>
        <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

