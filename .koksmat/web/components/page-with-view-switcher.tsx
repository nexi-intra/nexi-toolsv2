"use client";

import React, { useState } from "react";
import { Grid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCardMediumComponent } from "./tool-card-medium";

import { ComponentDoc } from "./component-documentation-hub";
import { ToolSearchProps } from "./tool-search";
import { mockTools } from "./mockTools";
import TokenInput, { ErrorDetail } from "./token-input";
import { kVerbose } from "@/lib/koksmat-logger-client";
import { ToolView } from "@/app/tools/schemas/forms";
import { ToolList } from "./tool-list";

type ViewMode = "cards" | "table" | "list";

interface ToolsPageProps {
  className?: string;
}

export function ToolsPage({ className = "" }: ToolsPageProps) {
  return <ToolList />
  // const [viewMode, setViewMode] = useState<ViewMode>("cards");
  // const [tools, setTools] = useState<ToolView[]>(mockTools);
  // const [searchQuery, setSearchQuery] = useState("");

  // const filteredTools = tools.filter(
  //   (tool) =>
  //     tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  // const renderTools = () => {
  //   switch (viewMode) {
  //     case "cards":
  //       return (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4">
  //           {filteredTools.map((tool) => (
  //             <ToolCardMediumComponent
  //               key={tool.id}
  //               tool={tool}
  //               isFavorite={false}
  //               allowedTags={[]}

  //             />
  //           ))}
  //         </div>
  //       );
  //     case "table":
  //       return (
  //         <div className="overflow-x-auto w-full">
  //           <table className="w-full">
  //             <thead>
  //               <tr>
  //                 <th className="text-left p-2">Name</th>
  //                 <th className="text-left p-2">Description</th>
  //                 <th className="text-left p-2">Version</th>
  //                 <th className="text-left p-2">Status</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {filteredTools.map((tool) => (
  //                 <tr key={tool.id}>
  //                   <td className="p-2">{tool.name}</td>
  //                   <td className="p-2">{tool.description}</td>
  //                   <td className="p-2">{tool.version}</td>
  //                   <td className="p-2">{tool.status}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       );
  //     case "list":
  //       return (
  //         <ul className="space-y-4 w-full">
  //           {filteredTools.map((tool) => (
  //             <li key={tool.id} className="border-b pb-4 w-full">
  //               <h3 className="font-semibold">{tool.name}</h3>
  //               <p>{tool.description}</p>
  //               <p className="text-sm text-muted-foreground mt-1">
  //                 Version: {tool.version} | Status: {tool.status}
  //               </p>
  //             </li>
  //           ))}
  //         </ul>
  //       );
  //   }
  // };

  // return (
  //   <div className={`space-y-4 ${className} w-full`}>
  //     <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
  //       {/* <Input
  //         type="text"
  //         placeholder="Search tools..."
  //         onChange={(e) => handleSearch(e.target.value)}
  //         className="w-full flex-grow"
  //       /> */}
  //       <TokenInput properties={[]} value={""}
  //         onChange={function (value: string, hasErrors: boolean, errors: ErrorDetail[]): void {
  //           kVerbose("component", "TokenInput value", value, hasErrors, errors);
  //           if (hasErrors) {
  //             console.log(errors);
  //           }

  //           className = "w-full";
  //         }} placeholder="Search tools ..." />


  //       <div className="flex gap-2">
  //         <Button
  //           variant={viewMode === "cards" ? "default" : "outline"}
  //           onClick={() => setViewMode("cards")}
  //           aria-label="Card view"
  //         >
  //           <Grid className="w-4 h-4" />
  //         </Button>
  //         <Button
  //           variant={viewMode === "table" ? "default" : "outline"}
  //           onClick={() => setViewMode("table")}
  //           aria-label="Table view"
  //         >
  //           <Table className="w-4 h-4" />
  //         </Button>
  //         <Button
  //           variant={viewMode === "list" ? "default" : "outline"}
  //           onClick={() => setViewMode("list")}
  //           aria-label="List view"
  //         >
  //           <List className="w-4 h-4" />
  //         </Button>
  //       </div>
  //     </div>
  //     {renderTools()}
  //   </div>
  //);
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
