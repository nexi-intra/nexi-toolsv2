"use client"
import { queries } from "@/app/global";
import { LinkListProps } from "@/app/koksmat/src/v.next/components/_shared";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import Link from "next/link";
import { ToolExplorerFiltered } from "./tool-list";
import { databaseTable } from "@/app/tools/schemas/database/table";
import { GenericTableEditor } from "@/app/koksmat/src/v.next/components";
import { Card, CardContent, CardHeader } from "./ui/card";
import DatabaseItemDialog from "@/app/koksmat/src/v.next/components/database-item-dialog";



const VIEWNAME = "categories"

const table = databaseTable.category
const databaseName = "tools"

export function CategoryList() {
  const view = queries.getView(VIEWNAME)

  return (

    <DatabaseItemsViewer
      tableName={table.tablename}
      schema={view.schema}
      options={{ hideToolbar: false }}
      addItem={() => {
        return <GenericTableEditor schema={table.schema} tableName={table.tablename} databaseName={databaseName} defaultMode={"new"}
          showJSON={true}

          onUpdated={() => document.location.reload()} id={0} />
      }}
      renderItem={(item, viewMode) => {
        return <Card className="min-w-[300px]">
          <CardHeader>
            <h2>{item.name}</h2>
          </CardHeader>
          <CardContent>
            <DatabaseItemDialog id={item.id} schema={table.schema} tableName={table.tablename} databaseName={databaseName} />
          </CardContent>
        </Card>
      }
      }
      viewName={VIEWNAME} />
  )
}

export function CategoryListLinker({ searchFor, basePath, prefix, onLoaded }: LinkListProps) {
  const view = queries.getView("categories")
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      tableName={databaseTable.category.tablename}
      renderItem={(item, viewMode) => {
        return <div className="min-h-96 p-4 m-4 bg-white" key={item.id}>
          <div className="flex">
            <div className="text-xl" id={prefix + item.id}>{item.name}</div>
            <div className="grow"></div>
            <div><Link className="text-blue-500 hover:underline" href={`${basePath}/${item.id}`}>all</Link></div>
          </div>
          <ToolExplorerFiltered searchFor={searchFor} viewName="tools_for_category" parameters={[(item.id as number).toString()]} />
        </div>

      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic", onLoaded, defaultViewMode: 'raw' }}
      viewName={"categories"}
    />
  )
}