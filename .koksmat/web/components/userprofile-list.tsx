"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import UserProfileForm from "./userprofile-form";

export function UserProfileList() {
  const view = databaseQueries.getView("userprofiles")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <UserProfileForm />
        </div>
      }}

      viewName={"userprofiles"} />
  )
}

