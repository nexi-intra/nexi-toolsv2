"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import UserGroupForm from "./usergroup-form";

export function UserGroupsList() {
  const view = databaseQueries.getView("usergroups")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <UserGroupForm />
        </div>
      }}
      viewName={"usergroups"} />
  )
}

