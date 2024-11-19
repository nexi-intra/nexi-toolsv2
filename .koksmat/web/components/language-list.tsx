"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import LanguageForm from "./language-form";




export function LanguageList() {
  const view = queries.getView("languages")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <LanguageForm />
        </div>


      }}
      viewName={"languages"} />
  )
}

