"use client"
import { z, ZodType, ZodOptional } from 'zod'


import { SchemaForm } from './generic-schema-form'
import { Button } from '@/components/ui/button'
import { kError, kInfo, kVerbose, kWarn } from '@/lib/koksmat-logger-client'
import React, { useCallback, useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type GenericTableFormProps<T extends z.ZodObject<any, any>> = {
  databaseName: string;
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
  databaseName,
  showModeSelector = false,
  showJSON = true,
  onCreated,
  onUpdated,
  onDeleted,
  onRead

}: GenericTableFormProps<T>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const idParam = searchParams.get('id')
  const table = useKoksmatDatabase().table(tableName, databaseName, schema)
  const [mode, setMode] = useState<'view' | 'edit' | 'new' | 'copy'>(idParam ? 'edit' : 'new')
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
    seterror(errors.map(e => e.message).join(","))


  }, [errors])


  useEffect(() => {

    const load = async () => {
      if (id) {
        try {
          kVerbose("component", "Starting read operation");
          const readDataOperation = await table.read(id)

          const parsedData = schema.safeParse(readDataOperation.record)
          if (!parsedData.success) {
            kError("component", "Data is undefined, cannot read region", parsedData.error);
            seterror("Cannot read" + parsedData.error)
            return
          }
          setData(parsedData.data)
          kVerbose("component", "Completed read operation");
          //TODO: This is a bit of a hack, but it works for now to get the data out of the form
          //onRead && onRead(id,parsedData.data)
        } catch (error) {
          seterror("" + error)
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
          setMode('edit')
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
  const handleDelete = async () => {
    try {
      kVerbose("component", "Starting delete operation");
      if (id) {
        await table.delete(id)
        kVerbose("component", "Completed delete operation");
        onDeleted && onDeleted(id)
      }
    } catch (error) {
      kError("component", "An error occurred:", error);
      seterror("Cannot delete" + error)
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
          <Button disabled={!id} onClick={() => setMode('view')} variant={mode === 'view' ? 'outline' : 'link'}>View</Button>
          <Button disabled={!id} onClick={() => {
            setMode('edit')
          }} variant={mode === 'edit' ? 'outline' : 'link'}>Edit</Button>

          <Button disabled={!id} onClick={() => setMode('copy')} variant={mode === 'copy' ? 'outline' : 'link'}>Make a copy</Button>
          <Button onClick={() => {
            setData(undefined)
            setMode('new')
          }} variant={mode === 'new' ? 'outline' : 'link'}>Create new</Button>
          <Button onClick={handleDelete} disabled={!id} variant={'outline'} >Delete</Button>
          <Button variant={"default"} disabled={!isValid} onClick={handleSave}> Save</Button>
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

