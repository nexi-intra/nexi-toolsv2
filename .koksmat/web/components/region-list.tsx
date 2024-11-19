"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";




export function RegionList() {
  const view = queries.getView("regions")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      viewName={"regions"} />
  )
}

