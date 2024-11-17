"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { queries } from "@/app/tools/schemas/database";
import UserGroupForm from "./usergroup-form";

export function UserGroupsList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <UserGroupForm />
        </div>
      }}
      viewName={"usergroup"} />
  )
}

