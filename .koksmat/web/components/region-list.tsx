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




export function RegionList() {
  const view = queries.getView("regions")
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
      viewName={"regions"} />
  )
}

