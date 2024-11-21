"use client"
import { z, ZodObject } from 'zod'


import { kError, kInfo, kVerbose } from '@/lib/koksmat-logger-client'
import React, { useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { useSearchParams } from 'next/navigation'
import { ItemViewerComponent } from './item-viewer'
import { Base, BaseSchema, EditItemFunction, RenderItemFunction } from './_shared'
import { databaseQueries } from '@/app/tools/schemas/database'

import { fromError } from 'zod-validation-error';
import { ViewNames } from '@/app/tools/schemas/database/view'

type DatabaseItemsViewerProps<S extends z.ZodType<any, any, any>> = {
  viewName: ViewNames;
  schema: S;
  renderItem?: RenderItemFunction<z.infer<S>>;
  editItem?: EditItemFunction<z.infer<S>>;

}

export function DatabaseItemsViewer<S extends z.ZodType<any, any, any>>({

  viewName,
  renderItem,
  editItem


}: DatabaseItemsViewerProps<S>) {

  type T = z.infer<S>;
  const searchParams = useSearchParams()
  const view = databaseQueries.getView(viewName)
  const table = useKoksmatDatabase().table("", view!.databaseName, view!.schema)
  const [items, setItems] = useState<T[]>()

  const [error, seterror] = useState("")


  useEffect(() => {

    const load = async () => {
      try {
        kVerbose("component", "Starting read operation");
        const readDataOperation = await table.query(viewName)
        if (readDataOperation.length === 0) {
          setItems([])
          kInfo("component", "No data found");
          return
        }

        const itemsSchema = z.array(view!.schema)
        // parse some invalid value
        try {
          const parsedData = itemsSchema.parse(readDataOperation);
          setItems(parsedData as any)
          kVerbose("component", "Completed read operation");

        } catch (err) {
          const validationError = fromError(err);
          // the error is now readable by the user
          // you may print it to console
          console.log(validationError.toString());
          // or return it as an actual error
          seterror("" + validationError.toString())
          kError("component", "Parse error", validationError.toString());
        }
        // const parsedData = itemsSchema.safeParse(readDataOperation)
        // if (!parsedData.success) {
        //   const errMap = new Map<string, string>()

        //   parsedData.error.issues.forEach((issue) => {
        //     if (errMap.has(issue.path[1])) {
        //       kError("component", "Parsing errors", issue.message);
        //     }

        //     kError("component", "Parsing errors", parsedData.error);
        //     seterror("Cannot read" + parsedData.error)
        //     return
        //   }

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
      {view && (
        <ItemViewerComponent
          items={items || []}
          renderItem={renderItem}
          editItem={editItem}
          properties={[]}
          onSearch={(query) => kInfo("component", 'Search query:', query)}
          options={{ pageSize: 25, heightBehaviour: 'Full' }}
          schema={view.schema} />)}

    </div >
  )
}

