"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import AccessPointForm from "./access-point-form";

export function AccessPointList() {
  const view = databaseQueries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <AccessPointForm />
        </div>


      }}
      viewName={"accesspoints"} />
  )
}

