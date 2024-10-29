"use client";

import React, { useState, useMemo } from "react";
import { Grid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentDoc } from "./component-documentation-hub";

// Define the Tool type
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Define the view modes
type ViewMode = "cards" | "table" | "list";

// Define the ToolSearchProps interface
export interface ToolSearchProps {
  onSearch: (query: string) => void;
  onNewResult?: (results: Tool[]) => void;
  className?: string;
  tools: Tool[];
}

interface ToolsPageProps {
  tools: Tool[];
  className?: string;
  SearchComponent: React.ComponentType<ToolSearchProps>;
}

export function ToolsPage({
  tools,
  className = "",
  SearchComponent,
}: ToolsPageProps) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const handleSearch = (query: string) => {
    const results = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTools(results);
  };

  // Render tools based on view mode
  const renderTools = () => {
    switch (viewMode) {
      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tool.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Category: {tool.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool) => (
                  <tr key={tool.id}>
                    <td className="p-2">{tool.name}</td>
                    <td className="p-2">{tool.description}</td>
                    <td className="p-2">{tool.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "list":
        return (
          <ul className="space-y-4">
            {filteredTools.map((tool) => (
              <li key={tool.id} className="border-b pb-4">
                <h3 className="font-semibold">{tool.name}</h3>
                <p>{tool.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: {tool.category}
                </p>
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <SearchComponent
          onSearch={handleSearch}
          onNewResult={setFilteredTools}
          className="w-full sm:w-64"
          tools={tools}
        />
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            onClick={() => setViewMode("cards")}
            aria-label="Card view">
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            aria-label="Table view">
            <Table className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            aria-label="List view">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {renderTools()}
    </div>
  );
}

// Example data
const exampleTools: Tool[] = [
  {
    id: "1",
    name: "Code Editor",
    description: "A powerful code editor with syntax highlighting",
    category: "Development",
  },
  {
    id: "2",
    name: "Image Processor",
    description: "Process and edit images with ease",
    category: "Graphics",
  },
  {
    id: "3",
    name: "Database Manager",
    description: "Manage your databases efficiently",
    category: "Data",
  },
  {
    id: "4",
    name: "Task Scheduler",
    description: "Schedule and manage your tasks",
    category: "Productivity",
  },
  {
    id: "5",
    name: "Network Analyzer",
    description: "Analyze and optimize your network",
    category: "Networking",
  },
];

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
      className={`p-2 border rounded ${className}`}
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
import { ToolsPage } from './tools-page'
import { YourSearchComponent } from './your-search-component'

// In your page or component:
<ToolsPage tools={yourToolsArray} SearchComponent={YourSearchComponent} />
  `,
    example: (
      <ToolsPage
        tools={exampleTools}
        SearchComponent={ExampleSearchComponent}
      />
    ),
  },
];

export default ToolsPage;
