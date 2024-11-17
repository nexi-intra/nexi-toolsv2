"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { queries } from "@/app/tools/schemas/database";
import UserProfileForm from "./userprofile-form";

export function UserProfileList() {
  const view = queries.getView("tools")
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <UserProfileForm />
        </div>
      }}

      viewName={"userprofile"} />
  )
}

