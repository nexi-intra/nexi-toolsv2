"use client"
import { queries } from "@/app/global";
import { GenericTableEditor } from "@/app/koksmat/src/v.next/components";
import DatabaseItemDialog from "@/app/koksmat/src/v.next/components/database-item-dialog";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseQueries } from "@/app/tools/schemas/database";
import { databaseTable } from "@/app/tools/schemas/database/table";
import { Card, CardHeader, CardContent } from "./ui/card";

const VIEWNAME = "accesspoints"
const table = databaseTable.accesspoint
const databaseName = "tools"

export function AccessPointList() {
  const view = queries.getView("accesspoints")

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

