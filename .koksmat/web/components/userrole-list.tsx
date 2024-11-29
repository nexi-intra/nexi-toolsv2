"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import UserRoleTableEditor from "./userrole-form";




export function UserRoleList() {
  const view = queries.getView("userroles")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <UserRoleTableEditor />
        </div>
      }}
      viewName={"userroles"} />
  )
}

