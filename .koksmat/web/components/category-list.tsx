"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";




export function CategoryList() {
  const view = queries.getView("categories")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      viewName={"categories"} />
  )
}

