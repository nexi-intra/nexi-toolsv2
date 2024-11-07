"use client"
import { z, ZodType, ZodOptional } from 'zod'


import { SchemaForm } from './schema-form'
import { Button } from '@/components/ui/button'
import { kError, kInfo, kVerbose } from '@/lib/koksmat-logger-client'
import React, { useState } from 'react'


import { DatabaseHandlerType } from '../lib/database-handler'

type GenericTableFormProps<T extends z.ZodObject<any, any>> = {
  schema: T;
  showModeSelector?: boolean
  showJSON?: boolean
  databaseHandler?: DatabaseHandlerType<T>
}
export function GenericTableEditor<T extends z.ZodObject<any, any>>({
  schema,
  showModeSelector = true,
  showJSON = true,
  databaseHandler
}: GenericTableFormProps<T>) {
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('new')
  const [data, setData] = useState<z.TypeOf<T>>()
  const [isValid, setisValid] = useState(false)
  const [errors, seterrors] = useState<Array<{ field: string; message: string }>>([])

  const handleSave = async () => {

    try {
      kVerbose("Starting save operation");
      if (data && databaseHandler) {
        const x = await databaseHandler.create(data);
      } else {
        kError("Data is undefined, cannot create region");
      }


    } catch (error) {
      kError("An error occurred:", error);
    }

  }

  const handleChange = (isValid: boolean, newData: z.TypeOf<T>, errors: Array<{ field: string; message: string }>) => {
    setData(newData)
    setisValid(isValid)
    seterrors(errors)
    kInfo(`Data updated in ${mode} mode:`, { isValid, data: newData, errors })
  }


  return (
    <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg w-full">
      {showModeSelector &&
        <div className="space-x-2">
          <Button onClick={() => setMode('view')} variant={mode === 'view' ? 'default' : 'outline'}>View</Button>
          <Button onClick={() => setMode('edit')} variant={mode === 'edit' ? 'default' : 'outline'}>Edit</Button>
          <Button onClick={() => setMode('new')} variant={mode === 'new' ? 'default' : 'outline'}>New</Button>
          <Button variant={"secondary"} onClick={handleSave}> Save</Button>
        </div>}
      <SchemaForm
        schema={schema}
        initialData={data}
        mode={mode}
        //onChange={handleChange}
        omit={['tenant', 'searchindex']}
        onChange={handleChange} />
      <div className="mt-4">
        {!isValid && (

          <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(errors, null, 2)}
          </pre>)}
        {showJSON &&
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">Resulting JSON:</h3>
            <pre className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre></div>}
      </div>
    </div >
  )
}

