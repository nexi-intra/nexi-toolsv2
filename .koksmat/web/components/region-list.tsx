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


const VIEWNAME = "regions"

export function RegionList() {
  const view = queries.getView(VIEWNAME)
  const [edit, setedit] = useState(false)
  return (

    <DatabaseItemsViewer
      renderItem={(region, viewMode) => {
        return <Card>

          <CardHeader>
            <CardTitle>{region.name}</CardTitle>
            <CardDescription>{region.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <p>Card Content</p> */}
          </CardContent>
          {/* <CardFooter className="object-right">
            <Button variant={"link"}>Edit</Button>
          </CardFooter> */}

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
