"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { LinkListProps } from "@/app/koksmat/src/v.next/components/_shared";
import { ToolExplorerFiltered } from "./tool-list";


import { databaseTable } from "@/app/tools/schemas/database/table";
import DatabaseItemDialog from "@/app/koksmat/src/v.next/components/database-item-dialog";
import { GenericTableEditor } from "@/app/koksmat/src/v.next/components";


const VIEWNAME = "regions"

export function RegionList() {
  const databaseName = "tools"
  const view = queries.getView(VIEWNAME)
  const table = databaseTable.region
  const [edit, setedit] = useState(false)
  return (
    <DatabaseItemsViewer
      tableName={table.tablename}
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
      schema={view.schema}
      viewName={VIEWNAME} />
  )
}

export function RegionListLinker({ searchFor, basePath, prefix, onLoaded }: LinkListProps) {
  const view = queries.getView(VIEWNAME)
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      tableName={databaseTable.region.tablename}
      renderItem={(item, viewMode) => {
        return <div className="min-h-96 p-4 m-4 bg-white" key={item.id}>
          <div className="flex">
            <div className="text-xl" id={prefix + item.id}>{item.name}</div>
            <div className="grow"></div>
            <div><Link className="text-blue-500 hover:underline" href={`${basePath}/${item.id}`}>more</Link></div>
          </div>
          <ToolExplorerFiltered searchFor={searchFor} viewName="tools_for_region" parameters={[(item.id as number).toString()]} />
        </div>

      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic", onLoaded, defaultViewMode: 'raw' }}
      viewName={VIEWNAME}
    />
  )
}
