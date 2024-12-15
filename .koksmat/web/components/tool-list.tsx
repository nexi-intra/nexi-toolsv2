"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { ToolCardMediumComponent } from "./tool-card-medium";
import { ToolView } from '@/app/tools/schemas/forms'

import { databaseQueries } from "@/app/tools/schemas/database";
import { use, useContext } from "react";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";
import { ParametersType } from "@/app/koksmat/src/v.next/lib/database-handler";
import { ViewNames } from "@/app/tools/schemas/database/view";
import { databaseTable } from "@/app/tools/schemas/database/table";
import { GenericTableEditor } from "@/app/koksmat/src/v.next/components";

export function ToolList() {
  const databaseName = "tools"
  const view = databaseQueries.getView("tools")
  const table = databaseTable.tool
  return (
    <DatabaseItemsViewer
      schema={view.schema}
      tableName={databaseTable.tool.tablename}
      options={{ heightBehaviour: "Full" }}
      addItem={() => {
        return <GenericTableEditor schema={table.schema} tableName={table.tablename} databaseName={databaseName} defaultMode={"new"}
          showJSON={true}
          onUpdated={() => document.location.reload()} id={0} />
      }}
      renderItem={(tool, viewMode) => {

        const toolView: ToolView = {

          id: tool.id,
          name: tool.name,
          description: tool.description,
          url: tool.url,
          created_by: tool.created_by,
          updated_by: tool.updated_by,
          deleted_at: tool.deleted_at,
          icon: tool.icon ?? "/placeholder.svg",
          groupId: "",
          documents: tool.documents,
          purposes: tool.purposes.map((purpose: any) => { return { id: purpose.id, value: purpose.name } }),
          countries: tool.countries.map((country: any) => { return { id: country.id, value: country.name } }),
          tags: tool.tags,
          version: "",
          status: tool.status,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
          category: { color: tool.category_color, id: tool.category_id, value: tool.category_name, order: "" },
        }

        return <div>
          <ToolCardMediumComponent
            showActions
            tool={toolView}
            isFavorite={tool.is_favorite} allowedTags={[]}

          />

        </div>
      }}
      viewName={"tools"} />
  )
}


export function ToolExplorer(props: { searchFor?: string; onLoaded?: () => void }) {
  const { onLoaded, searchFor } = props

  const view = databaseQueries.getView("tools")
  return (
    <DatabaseItemsViewer
      tableName={databaseTable.tool.tablename}
      schema={view.schema}
      searchFor={searchFor}

      options={{ heightBehaviour: "Dynamic", hideToolbar: true, onLoaded, pageSize: 25 }}
      renderItem={(tool, viewMode) => {

        const toolView: ToolView = {

          id: tool.id,
          name: tool.name,
          description: tool.description,
          url: tool.url,
          created_by: tool.created_by,
          updated_by: tool.updated_by,
          deleted_at: tool.deleted_at,
          icon: tool.icon ?? "/placeholder.svg",
          groupId: "",
          documents: tool.documents,
          purposes: tool.purposes.map((purpose: any) => { return { id: purpose.id, value: purpose.name } }),
          countries: tool.countries.map((country: any) => { return { id: country.id, value: country.name } }),
          tags: tool.tags,
          version: "",
          status: tool.status,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
          category: { color: tool.category_color, id: tool.category_id, value: tool.category_name, order: "" },
        }

        return <div>
          <ToolCardMediumComponent
            showActions
            tool={toolView}
            isFavorite={tool.is_favorite} allowedTags={[]}


          />

        </div>
      }}
      viewName={"tools"} />
  )
}

export function ToolExplorerFiltered(props: {
  searchFor?: string;
  filter?: string;
  viewName?: ViewNames,
  parameters?: ParametersType;
  pageSize?: number;
  onLoaded?: () => void
}) {
  const { onLoaded, searchFor } = props
  // if (props.parameters && props.parameters.length > 0) {

  //   console.log("parameters", props.parameters)
  // }
  if (props.viewName) {
    //debugger
    console.log("viewName", props.viewName)
  }
  const viewName: ViewNames = props.viewName ?? "tools"
  const view = databaseQueries.getView(viewName)
  return (
    <DatabaseItemsViewer
      tableName={databaseTable.tool.tablename}
      schema={view.schema}
      searchFor={searchFor}
      parameters={props.parameters}

      options={{ heightBehaviour: "Dynamic", hideToolbar: true, onLoaded, pageSize: props.pageSize ?? 5 }}
      renderItem={(tool, viewMode) => {

        const toolView: ToolView = {

          id: tool.id,
          name: tool.name,
          description: tool.description,
          url: tool.url,
          created_by: tool.created_by,
          updated_by: tool.updated_by,
          deleted_at: tool.deleted_at,
          icon: tool.icon ?? "/placeholder.svg",
          groupId: "",
          documents: tool.documents,
          purposes: tool.purposes.map((purpose: any) => { return { id: purpose.id, value: purpose.name } }),
          countries: tool.countries.map((country: any) => { return { id: country.id, value: country.name } }),
          tags: tool.tags,
          version: "",
          status: tool.status,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
          category: { color: tool.category_color, id: tool.category_id, value: tool.category_name, order: "" },
        }

        return <div>
          <ToolCardMediumComponent
            showActions
            tool={toolView}
            isFavorite={tool.is_favorite} allowedTags={[]}


          />

        </div>
      }}
      viewName={viewName} />
  )
}

