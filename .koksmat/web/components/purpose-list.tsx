"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { queries } from "@/app/tools/schemas/database";
import PurposeForm from "./purpose-form";

export function PurposesList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <PurposeForm />
        </div>


      }}
      viewName={"purpose"} />
  )
}

