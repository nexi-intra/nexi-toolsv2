"use client"

import { z } from 'zod'
import { kError, kInfo, kVerbose } from '@/lib/koksmat-logger-client'
import React, { useEffect, useState } from 'react'
import { useKoksmatDatabase } from './database-context-provider'
import { useSearchParams } from 'next/navigation'
import { ItemViewerComponent } from './item-viewer'
import { Base, DatabaseItemsViewerProps, ViewMode } from './_shared'
import { databaseQueries } from '@/app/tools/schemas/database'
import { fromError } from 'zod-validation-error'
import { useLanguage } from "@/components/language-context"

type SupportedLanguage = "en" | "da" | "it"

const translationSchema = z.object({
  loading: z.string(),
  noItems: z.string(),
  error: z.string(),
})

type TranslationType = z.infer<typeof translationSchema>

const translations: Record<SupportedLanguage, TranslationType> = {
  en: {
    loading: "Loading...",
    noItems: "No items",
    error: "Error: ",
  },
  da: {
    loading: "Indlæser...",
    noItems: "Ingen elementer",
    error: "Fejl: ",
  },
  it: {
    loading: "Caricamento...",
    noItems: "Nessun elemento",
    error: "Errore: ",
  },
}

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
  const { language } = useLanguage()
  const t = translations[language]

  type T = z.infer<S>
  const searchParams = useSearchParams()
  const view = databaseQueries.getView(viewName)
  const table = useKoksmatDatabase().table("", view!.databaseName, view!.schema)
  const [items, setItems] = useState<T[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const pageSize = options.pageSize || 250
  const heightBehaviour = options.heightBehaviour || 'Full'
  const mode = options.mode || 'view'

  useEffect(() => {
    const load = async () => {
      try {
        setError("")
        kVerbose("component", "Starting read operation")
        if (viewName === "tools_for_purpose") {
          //debugger
        }
        const readDataOperation = await table.query(viewName, parameters)
        setIsLoading(false)
        if (readDataOperation?.length === 0 || !readDataOperation) {
          setItems([])
          kInfo("component", "No data found")
          return
        }

        const itemsSchema = z.array(view!.schema)
        try {
          const parsedData = itemsSchema.safeParse(readDataOperation)
          if (parsedData.success === false) {
            setError(t?.error + parsedData.error)
          }
          setItems(parsedData.data as any)
          if (options.onLoaded) {
            options.onLoaded(parsedData.data as Base[])
          }
          kVerbose("component", "Completed read operation")
        } catch (err) {
          const validationError = fromError(err)
          console.log(validationError.toString())
          setError(t?.error + validationError.toString())
          kError("component", "Parse error", validationError.toString())
        }
      } catch (error) {
        setError(t?.error + error)
        kError("component", "Data read error", error)
      }
    }
    load()
  }, [options.version, t])

  if (isLoading) {
    return <div className="text-center">{t?.loading}</div>
  }
  if (items?.length < 1) {
    if (options.componentNoItems) {
      return options.componentNoItems
    }
    return <div className="text-center">{t?.noItems}</div>
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
              pageSize,
              heightBehaviour,
              hideToolbar: options.hideToolbar,
              onLoaded: options.onLoaded,
              defaultViewMode: options.defaultViewMode
            }}
            schema={view.schema}
            tableName={tableName}
            databaseName={view.databaseName}
          />
        </div>
      )}
    </div>
  )
}

