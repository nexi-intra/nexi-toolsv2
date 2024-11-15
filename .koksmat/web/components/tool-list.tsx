"use client"
import { useKoksmatDatabase } from "@/app/koksmat/src/v.next/components/database-context-provider";
import { ItemViewerComponent } from "@/app/koksmat/src/v.next/components/item-viewer";
import { queries } from "@/app/tools/schemas/database";
import { kInfo } from "@/lib/koksmat-logger-client";



export function ToolList() {

  const view = queries.getView("tools")
  const database = useKoksmatDatabase()

  return (
    <ItemViewerComponent
      items={[]}
      properties={[]}
      onSearch={(query) => kInfo("component", 'Search query:', query)}
      options={{ pageSize: 10, heightBehaviour: 'Full' }}
      schema={view.schema} />

  )
}

