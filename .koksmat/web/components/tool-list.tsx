"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { ToolCardMediumComponent } from "./tool-card-medium";
import { ToolView } from "@/app/tools/schemas";
import { queries } from "@/app/tools/schemas/database";

export function ToolList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      renderItem={(tool, viewMode) => {
        const toolView: ToolView = {
          id: tool.id,
          name: tool.name,
          description: tool.description,
          created_by: tool.created_by,
          updated_by: tool.updated_by,
          deleted_at: tool.deleted_at,
          url: tool.url,
          groupId: "",
          purposes: [],
          tags: [],
          version: "",
          status: "active",
          created_at: tool.created_at,
          updated_at: tool.updated_at,
        }

        return <div>
          <ToolCardMediumComponent
            tool={toolView} onFavoriteChange={function (isFavorite: boolean): void {

            }} allowedTags={[]}

          />

        </div>
      }}
      viewName={"tools"} />
  )
}

