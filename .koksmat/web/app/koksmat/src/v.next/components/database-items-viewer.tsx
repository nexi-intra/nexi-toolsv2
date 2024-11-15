"use client"
import { z, ZodObject } from 'zod'


import { kError, kInfo, kVerbose } from '@/lib/koksmat-logger-client'
import React, { useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { useSearchParams } from 'next/navigation'
import { ItemViewerComponent } from './item-viewer'
import { Base, BaseSchema } from './_shared'

type DatabaseItemsViewerProps<T extends Base> = {
  databaseName: string;
  viewName: string;
  schema: ZodObject<Record<string, z.ZodTypeAny>>;

}

export function DatabaseItemsViewer<T extends Base>({
  schema,
  viewName,
  databaseName,

}: DatabaseItemsViewerProps<T>) {
  const searchParams = useSearchParams()

  const table = useKoksmatDatabase().table("", databaseName, schema)
  const [items, setItems] = useState<T[]>()

  const [error, seterror] = useState("")


  useEffect(() => {

    const load = async () => {
      try {
        kVerbose("component", "Starting read operation");
        const readDataOperation = await table.query(viewName)
        debugger
        // const parsedData = schema.safeParse(readDataOperation.record)
        // if (!parsedData.success) {
        //   kError("component", "Data is undefined, cannot read region", parsedData.error);
        //   seterror("Cannot read" + parsedData.error)
        //   return
        // }
        //setItems(readDataOperation)
        kVerbose("component", "Completed read operation");

      } catch (error) {
        seterror("" + error)
        kError("component", "Data read error", error);
      }
    }
    load()
  }, [])





  return (
    <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg w-full">

      {error && <div className='text-red-500'>{error}</div>}

      <ItemViewerComponent
        items={items || []}
        renderItem={(item, mode) => (<div>{item.name + "(" + item.name + ")"}</div>)

        }
        properties={[]}
        onSearch={(query) => kInfo("component", 'Search query:', query)}
        options={{ pageSize: 10, heightBehaviour: 'Full' }}
        schema={schema} />

    </div >
  )
}

