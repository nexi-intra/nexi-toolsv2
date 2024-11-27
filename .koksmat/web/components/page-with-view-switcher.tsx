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
import { CategoryListLinker } from "./category-list";

type ViewMode = "cards" | "table" | "list";

interface ToolsPageProps {
  className?: string;
}

export function ToolsPage({ className = "" }: ToolsPageProps) {
  return <div className="h-full w-full">
    <ToolList />
    <CategoryListLinker basePath={"/safds"} />
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
