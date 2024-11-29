"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import Link from "next/link";



const VIEWNAME = "countries"
export function CountryList() {
  const view = queries.getView(VIEWNAME)
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      viewName={VIEWNAME} />
  )
}

export function CountryListLinker({ basePath, prefix }: { basePath: string, prefix: string }) {
  const view = queries.getView(VIEWNAME)
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      renderItem={(country, viewMode) => {
        return <Link id={prefix + country.id} className="text-blue-500 hover:underline" href={`${basePath}/${country.id}`}>{country.name}</Link>
      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic" }}
      viewName={VIEWNAME}
    />
  )
}