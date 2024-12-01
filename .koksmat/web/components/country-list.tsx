"use client"
import { queries } from "@/app/global";
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { databaseTable } from "@/app/tools/schemas/database/table";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import DatabaseItemDialog from "@/app/koksmat/src/v.next/components/database-item-dialog";
import { GenericTableEditor } from "@/app/koksmat/src/v.next/components";


const VIEWNAME = "countries"
const table = databaseTable.country
const databaseName = "tools"

export function CountryList() {
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

export function CountryListLinker({ basePath, prefix }: { basePath: string, prefix: string }) {
  const view = queries.getView(VIEWNAME)
  return (

    <DatabaseItemsViewer
      schema={view.schema}
      tableName={databaseTable.country.tablename}
      renderItem={(country, viewMode) => {
        return <Link id={prefix + country.id} className="text-blue-500 hover:underline" href={`${basePath}/${country.id}`}>{country.name}</Link>
      }
      }
      options={{ hideToolbar: true, heightBehaviour: "Dynamic" }}
      viewName={VIEWNAME}
    />
  )
}