"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import PurposeForm from "./purpose-form";
import Link from "next/link";
import { Card } from "./ui/card";
import { LinkListProps } from "@/app/koksmat/src/v.next/components/_shared";
import { ToolExplorer, ToolExplorerFiltered } from "./tool-list";

const VIEWNAME = "purposes"
export function PurposesList() {
  const view = databaseQueries.getView(VIEWNAME)
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      editItem={function (item: any) {
        return <div>
          <PurposeForm />
        </div>


      }}
      viewName={VIEWNAME} />
  )
}




export function PurposesListLinker({ searchFor, basePath, prefix, onLoaded }: LinkListProps) {
  const view = databaseQueries.getView(VIEWNAME)
  return (
    <DatabaseItemsViewer
      schema={view.schema}

      renderItem={(item, viewMode) => {
        return <div className="min-h-96 p-4 m-4 bg-white" key={item.id}>
          <div className="flex">
            <div className="text-xl" id={prefix + item.id}>{item.name}</div>
            <div className="grow"></div>
            <div><Link className="text-blue-500 hover:underline" href={`${basePath}/${item.id}`}>all</Link></div>
          </div>
          <ToolExplorerFiltered searchFor={searchFor} parameters={{ lookupid: item.id }} />
        </div>

      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic", onLoaded, defaultViewMode: 'raw' }}

      viewName={VIEWNAME} />
  )
}


