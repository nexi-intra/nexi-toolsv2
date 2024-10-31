"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Grid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentDoc } from "./component-documentation-hub";
import { ApiClient, Tool } from "./app-api-entity-route";

// Define the Tool type

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
  className?: string;
  SearchComponent: React.ComponentType<ToolSearchProps>;
}

export function ToolsPage({ className = "", SearchComponent }: ToolsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [tools, setTools] = useState<Tool[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const toolClient = new ApiClient("tools", () => "YOUR_AUTH_TOKEN");

    const fetchTools = async () => {
      try {
        const data = await toolClient.getAll(page, pageSize);
        setTools(data.items);
        setTotalCount(data.totalCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, [page, pageSize]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSearch = (query: string) => {
    const results = tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
    );
    // setFilteredTools(results);
  };

  // Render tools based on view mode
  const renderTools = () => {
    switch (viewMode) {
      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Card key={tool.id}>
                <CardHeader>
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tool.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Category: {tool.name}
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
                {tools.map((tool) => (
                  <tr key={tool.id}>
                    <td className="p-2">{tool.name}</td>
                    <td className="p-2">{tool.description}</td>
                    <td className="p-2">{tool.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "list":
        return (
          <ul className="space-y-4">
            {tools.map((tool) => (
              <li key={tool.id} className="border-b pb-4">
                <h3 className="font-semibold">{tool.name}</h3>
                <p>{tool.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: {tool.name}
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
          onNewResult={() => {}}
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
    example: <ToolsPage SearchComponent={ExampleSearchComponent} />,
  },
];

export default ToolsPage;
