"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { ToolCardMediumComponent } from "./tool-card-medium";
import { ToolView } from '@/app/tools/schemas/forms'

import { databaseQueries } from "@/app/tools/schemas/database";


export function MyToolList() {
  const viewName = "my_tools"
  const view = databaseQueries.getView(viewName)
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      renderItem={(tool, viewMode) => {

        const toolView: ToolView = {

          id: tool.id,
          name: tool.name,
          description: tool.description,
          url: tool.url,
          created_by: tool.created_by,
          updated_by: tool.updated_by,
          deleted_at: tool.deleted_at,
          icon: tool.icon ?? "/placeholder.svg",
          groupId: "",
          documents: tool.documents,
          purposes: tool.purposes.map((purpose: any) => { return { id: purpose.id, value: purpose.name } }),
          countries: tool.countries.map((country: any) => { return { id: country.id, value: country.name } }),
          tags: tool.tags,
          version: "",
          status: tool.status,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
          category: { color: tool.category_color, id: tool.category_id, value: tool.category_name, order: "" },
        }

        return <div>
          <ToolCardMediumComponent
            showActions
            tool={toolView}
            isFavorite={tool.is_favorite} allowedTags={[]}

          />

        </div>
      }}
      viewName={viewName} />
  )
}

