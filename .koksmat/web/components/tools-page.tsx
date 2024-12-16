"use client";

import React, { useContext, useEffect, useState } from "react";
import { Grid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCardMediumComponent } from "./tool-card-medium";

import { ComponentDoc } from "./component-documentation-hub";
import { ToolSearchComponent, ToolSearchProps } from "./tool-search";
import { mockTools } from "./mockTools";
import TokenInput, { ErrorDetail } from "./token-input";
import { kVerbose } from "@/lib/koksmat-logger-client";
import { ToolView } from "@/app/tools/schemas/forms";
import { ToolExplorer, ToolList } from "./tool-list";
import { CategoryListLinker } from "./category-list";
import { TableOfContents } from "./TableOfContents";
import { CountryListLinker } from "./country-list";
import { RegionListLinker } from "./region-list";
import { set } from "date-fns";
import { PurposesListLinker } from "./purpose-list";
import { ca } from "date-fns/locale";
import { Property } from "./token-input-internal";
import { Base } from "@/app/koksmat/src/v.next/components/_shared";
import { MyToolList } from "./my-tool-list";
import Link from "next/link";
import { PopupFrame } from "./popup-frame";
import { MagicboxContext } from "@/app/koksmat0/magicbox-context";

type ViewMode = "cards" | "table" | "list";

interface ToolsPageProps {
  className?: string;
}
let v = 0
export function ToolsPage({ className = "" }: ToolsPageProps) {
  const [version, setversion] = useState(0)
  const magicbox = useContext(MagicboxContext)
  const [categories, setcategories] = useState<Base[]>([])
  const [regions, setregions] = useState<Base[]>([])
  const [purposes, setpurposes] = useState<Base[]>([])
  const [properties, setproperties] = useState<Property[]>([])
  const [searchFor, setsearchFor] = useState("")


  const onChildsRefreshed = () => {
    v++
    setversion(v)

  }

  const onRegionsLoaded = (items: Base[]) => {
    setregions(items)
    onChildsRefreshed()
  }
  const onCategoriesLoaded = (items: Base[]) => {
    setcategories(items)
    onChildsRefreshed()

  }

  const onPurposesLoaded = (items: Base[]) => {
    setpurposes(items)
    onChildsRefreshed()

  }


  useEffect(() => {

    setproperties([

      {
        name: "purpose",
        values: purposes.map((purpose: any) => { return { value: purpose.name, icon: null, color: purpose.color } })
      },
      // {
      //   name: "category",
      //   values: categories.map((category: any) => { return { value: category.name, icon: null, color: category.color } })
      // },
      // {
      //   name: "region",
      //   values: regions.map((region: any) => { return { value: region.name, icon: null, color: region.color } })
      // }
    ])

  }, [categories, regions, purposes])

  return <div className="h-full w-full">
    <div className="lg:flex">
      <main className="w-full lg:w-3/4">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
          <TokenInput
            placeholder="Search tools..."
            properties={properties} value={searchFor} onChange={function (value: string, hasErrors: boolean, errors: ErrorDetail[]): void {
              setsearchFor(value)
              //throw new Error("Function not implemented.");
            }} />
        </div>

        <div className="min-h-screen min-w-full ">

          <div className="relative">
            <h3 className="font-semibold mb-2 sticky top-10 bg-white dark:bg-gray-800 text-3xl z-10 p-4">Your Tools</h3>

            <MyToolList searchFor={searchFor} />
          </div>
          <div className="relative">
            <div className="flex">
              <h3 className="font-semibold mb-2 sticky top-10 text-3xl z-10 p-4">All Tools</h3>
              <div className="flex-grow"></div>
              <span className="text-right mr-4">
                <PopupFrame url={"https://home.nexi-intra.com/sso?token=TOKEN"} token={magicbox.authtoken} linkText="Your profile" dialogTitle={"Your Profile"} />
              </span>

            </div>
            <ToolExplorer onLoaded={onChildsRefreshed} searchFor={searchFor} />
          </div>
        </div>
        <div className="relative">
          <h3 className="font-semibold mb-2 sticky top-10 bg-white  dark:bg-gray-800 text-3xl z-10 p-4">Purposes</h3>
          <PurposesListLinker basePath={"/tools/pages/purpose"} prefix="purpose-" onLoaded={onPurposesLoaded} searchFor={searchFor} />
        </div>
        {/* <div className="relative">
          <h3 className="font-semibold mb-2 sticky top-10  bg-white text-3xl z-10 p-4">Categories</h3>
          <CategoryListLinker basePath={"/tools/pages/category"} prefix="category-" onLoaded={onCategoriesLoaded} searchFor={searchFor} />
        </div>
        <div className="relative">
          <h3 className="font-semibold mb-2 sticky top-10 bg-white text-3xl z-10 p-4">Regions</h3>
          <RegionListLinker basePath={"/tools/pages/region"} prefix="region-" onLoaded={onRegionsLoaded} searchFor={searchFor} />
        </div> */}
      </main>
      <aside className=" lg:visible  lg:w-1/4">
        <div className="font-semibold sticky top-0 bg-white dark:bg-gray-800 text-xl z-10 px-4">Categories</div>
        <TableOfContents
          version={version}
          sections={[{ title: "Purposes", prefix: "purpose-" }
            // , { title: "Categories", prefix: "category-" }, { title: "Regions", prefix: "region-" }

          ]} />

      </aside>
    </div>
  </div>
}

// Example SearchComponent
const ExampleSearchComponent: React.FC<ToolSearchProps> = ({
  onSearch,
  className,
}) => {
  return (
    <input
      type="text"
      placeholder="Search tools..."
      onChange={(e) => onSearch(e.target.value)}
      className={`p-2 border rounded w-full ${className}`}
    />
  );
};

// Component documentation
export const examplesToolsPage: ComponentDoc[] = [
  {
    id: "ToolsPage",
    name: "ToolsPage",
    description:
      "A component for displaying and searching tools with multiple view modes.",
    usage: `
import { ToolsPage } from './tools-page';
import { YourSearchComponent } from './your-search-component';

// In your page or component:
<ToolsPage tools={yourToolsArray} SearchComponent={YourSearchComponent} />;
    `,
    example: <ToolsPage />,
  },
];

export default ToolsPage;
