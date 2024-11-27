"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import Link from "next/link";




export function CategoryList() {
  const view = queries.getView("categories")
  return (

    <DatabaseItemsViewer
      schema={view.schema}

      viewName={"categories"}
    />
  )
}


export function CategoryListLinker({ basePath }: { basePath: string }) {
  const view = queries.getView("categories")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      renderItem={(category, viewMode) => {
        return <Link className="text-blue-500 hover:underline" href={`${basePath}/${category.id}`}>{category.name}</Link>
      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic" }}
      viewName={"categories"}
    />
  )
}