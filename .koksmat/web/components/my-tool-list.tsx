"use client"
import { DatabaseItemsViewer } from "@/app/koksmat/src/v.next/components/database-items-viewer";
import { ToolCardMediumComponent } from "./tool-card-medium";
import { ToolView } from '@/app/tools/schemas/forms'

import { databaseQueries } from "@/app/tools/schemas/database";
import { use, useContext, useEffect } from "react";
import { useUserProfile } from "./userprofile-context";
import { Popup } from "@/app/officeaddin/components/popup";
import { PopupFrame } from "./popup-frame";


export function MyToolList(props: { searchFor?: string; onLoaded?: () => void }) {

  const { version } = useUserProfile();
  const viewName = "my_tools"
  const view = databaseQueries.getView(viewName)


  return (
    <div className="relative">


      <DatabaseItemsViewer
        options={{
          heightBehaviour: "Dynamic",
          hideToolbar: true, version,
          componentNoItems: <div className="flex">
            <div className="grow" />
            <div className="p-10 border">
              <div className="text-2xl mb-2">No favourite tools</div>
              You haven't selected any favourite tools, find tools that you find relevant and click on the star
            </div>
            <div className="grow" />
          </div>


        }}
        searchFor={props.searchFor}
        schema={view.schema}
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
            purposes: tool.purposes.map((purpose: any) => { return { id: purpose.id, value: purpose.name }; }),
            countries: tool.countries.map((country: any) => { return { id: country.id, value: country.name }; }),
            tags: tool.tags,
            version: "",
            status: tool.status,
            created_at: tool.created_at,
            updated_at: tool.updated_at,
            category: { color: tool.category_color, id: tool.category_id, value: tool.category_name, order: "" },
          };

          return <div>
            <ToolCardMediumComponent

              tool={toolView}
              isFavorite={tool.is_favorite} allowedTags={[]} />

          </div>;
        }}
        viewName={viewName} tableName={""} />
    </div>
  )
}

