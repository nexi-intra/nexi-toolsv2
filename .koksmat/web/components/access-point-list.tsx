"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { queries } from "@/app/tools/schemas/database";
import AccessPointForm from "./access-point-form";

export function AccessPointList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <AccessPointForm />
        </div>


      }}
      viewName={"accesspoint"} />
  )
}

