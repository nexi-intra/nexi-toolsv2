"use client"
import { z, ZodObject } from 'zod'


import { kError, kInfo, kVerbose } from '@/lib/koksmat-logger-client'
import React, { useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { useSearchParams } from 'next/navigation'
import { ItemViewerComponent } from './item-viewer'
import { Base, BaseSchema, DatabaseItemsViewerProps, EditItemFunction, RenderItemFunction, ViewMode } from './_shared'
import { databaseQueries } from '@/app/tools/schemas/database'

import { fromError } from 'zod-validation-error';
import { set } from 'date-fns'




export function DatabaseItemsViewer<S extends z.ZodType<any, any, any>>({

  viewName,
  parameters,
  renderItem,
  editItem,
  addItem,
  searchFor,
  tableName,
  options = { pageSize: 250, heightBehaviour: 'Full', mode: 'view', hideToolbar: false, onLoaded: () => { }, defaultViewMode: 'card', version: 0 }


}: DatabaseItemsViewerProps<S>) {

  type T = z.infer<S>;
  const searchParams = useSearchParams()
  const view = databaseQueries.getView(viewName)
  const table = useKoksmatDatabase().table("", view!.databaseName, view!.schema)
  const [items, setItems] = useState<T[]>([])
  const [error, seterror] = useState("")
  const [isLoading, setisLoading] = useState(true)

  const pageSize = options.pageSize || 250
  const heightBehaviour = options.heightBehaviour || 'Full'
  const mode = options.mode || 'view'

  useEffect(() => {

    const load = async () => {
      try {
        seterror("")
        //setisLoading(true)
        //setItems([])
        kVerbose("component", "Starting read operation");
        if (viewName === "tools_for_purpose") {
          //debugger
        }
        const readDataOperation = await table.query(viewName, parameters)
        setisLoading(false)
        if (readDataOperation?.length === 0 || !readDataOperation) {
          setItems([])
          kInfo("component", "No data found");
          return
        }

        const itemsSchema = z.array(view!.schema)
        // parse some invalid value
        try {
          const parsedData = itemsSchema.safeParse(readDataOperation);
          if (parsedData.success === false) {
            seterror("Cannot read" + parsedData.error)


          }
          setItems(parsedData.data as any)
          if (options.onLoaded) {
            options.onLoaded(parsedData.data as Base[])
          }
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
  }, [options.version])


  if (isLoading) {
    return <div className="text-center" >Loading...</div>
  }
  if (items?.length < 1) {
    if (options.componentNoItems) {
      return options.componentNoItems
    }
    return <div className="text-center" >No items</div>

  }

  return (
    <div className="space-y-4 p-6 rounded-lg w-full">

      {error && <div className='text-red-500'>{error}</div>}

      {view && (
        <div className='w-full'>
          <ItemViewerComponent
            isLoading={isLoading}
            items={items || []}
            renderItem={renderItem}
            editItem={editItem}
            addItem={addItem}
            properties={[]}
            searchFor={searchFor}
            onSearch={(query) => kInfo("component", 'Search query:', query)}
            options={{
              componentNoItems: options.componentNoItems,
              pageSize, heightBehaviour, hideToolbar: options.hideToolbar, onLoaded: options.onLoaded, defaultViewMode: options.defaultViewMode
            }}
            schema={view.schema}
            tableName={tableName}
            databaseName={view.databaseName}

          />


        </div>
      )}

    </div >
  )
}

