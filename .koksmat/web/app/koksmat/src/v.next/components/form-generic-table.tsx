"use client"
import { z, ZodType, ZodOptional } from 'zod'


import { SchemaForm } from './schema-form'
import { Button } from '@/components/ui/button'
import { kError, kInfo, kVerbose, kWarn } from '@/lib/koksmat-logger-client'
import React, { useCallback, useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type GenericTableFormProps<T extends z.ZodObject<any, any>> = {
  tableName: string;
  schema: T;
  showModeSelector?: boolean
  showJSON?: boolean
  id?: number
  onCreated?: (id: number) => void
  onUpdated?: (id: number) => void
  onDeleted?: (id: number) => void
  onRead?: (id: number, item: T) => void

}


export function GenericTableEditor<T extends z.ZodObject<any, any>>({
  schema,
  tableName,
  showModeSelector = true,
  showJSON = true,
  onCreated,
  onUpdated,
  onDeleted

}: GenericTableFormProps<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const idParam = searchParams.get('search')
  const table = useKoksmatDatabase().table(tableName, schema)
  const [mode, setMode] = useState<'view' | 'edit' | 'new'>('new')
  const [data, setData] = useState<z.TypeOf<T>>()
  const [isValid, setisValid] = useState(false)
  const [id, setid] = useState<number>()
  const [errors, seterrors] = useState<Array<{ field: string; message: string }>>([])
  const [error, seterror] = useState("")

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )
  useEffect(() => {
    if (idParam) {
      setid(parseInt(idParam))
    }
  }, [idParam])
  useEffect(() => {

    const load = async () => {
      if (mode == 'edit' && id) {
        try {
          kVerbose("component", "Starting read operation");
          setData((await table.read(id)))
          kVerbose("component", "Completed read operation");
          onCreated && onCreated(id)
        } catch (error) {
          seterror("Cannot save" + error)
          kError("component", "Data is undefined, cannot create region", error);
        }
      }
    }
    load()
  }, [mode, id])

  const handleSave = async () => {
    try {
      //debugger
      kVerbose("component", "Starting save operation");
      if (data) {
        if (mode == 'edit' && id) {
          await table.update(id, data)
          kVerbose("component", "Completed save operation");
          onUpdated && onUpdated(id)
          return
        }
        if (mode == 'new') {
          const id = await table.create(data)
          kVerbose("component", "Completed save operation, got ", id);
          onCreated && onCreated(id)
          router.push(pathname + '?' + createQueryString('id', id.toString()))
        }
        kWarn("component", "No id found, cannot save")
      } else {
        kError("component", "Data is undefined, cannot create");
      }
    } catch (error) {
      kError("component", "An error occurred:", error);
      seterror("Cannot save" + error)
    }

  }

  const handleChange = (isValid: boolean, newData: z.TypeOf<T>, errors: Array<{ field: string; message: string }>) => {
    setData(newData)
    setisValid(isValid)
    seterrors(errors)
    kVerbose("component", `Data updated in ${mode} mode:`, { isValid, data: newData, errors })
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
      {error && <div className='text-red-500'>{error}</div>}
      <SchemaForm
        schema={schema}
        initialData={data}
        mode={mode}

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

