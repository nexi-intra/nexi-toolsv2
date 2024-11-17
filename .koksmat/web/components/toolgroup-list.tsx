"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { queries } from "@/app/tools/schemas/database";

export function ToolGroupsList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}

      viewName={"toolgroup"} />
  )
}

