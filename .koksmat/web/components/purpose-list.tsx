"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import PurposeForm from "./purpose-form";

export function PurposesList() {
  const view = databaseQueries.getView("purposes")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <PurposeForm />
        </div>


      }}
      viewName={"purposes"} />
  )
}

