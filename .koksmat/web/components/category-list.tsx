"use client"
import { queries } from "@/app/global";
import { LinkListProps } from "@/app/koksmat/src/v.next/components/_shared";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import Link from "next/link";
import { ToolExplorerFiltered } from "./tool-list";




export function CategoryList() {
  const view = queries.getView("categories")
  return (

    <DatabaseItemsViewer
      schema={view.schema}

      viewName={"categories"}
    />
  )
}


export function CategoryListLinker({ searchFor, basePath, prefix, onLoaded }: LinkListProps) {
  const view = queries.getView("categories")
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
          <ToolExplorerFiltered searchFor={searchFor} />
        </div>

      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic", onLoaded, defaultViewMode: 'raw' }}
      viewName={"categories"}
    />
  )
}