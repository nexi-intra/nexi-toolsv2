"use client";

import React, { useState } from "react";
import { Grid, List, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCardMediumComponent } from "./tool-card-medium";
import { Tool } from "@/app/tools/api/view/schemas";
import { ComponentDoc } from "./component-documentation-hub";
import { ToolSearchProps } from "./tool-search";

// Define the Tool type based on the provided schema

// Mock data
const mockTools: Tool[] = [
  {
    id: 1,
    name: "Microsoft Teams",
    description: "Team collaboration and communication platform",
    url: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",
    groupId: "group1",
    purposes: [
      { id: "purpose1", value: "Collaboration", order: "1" },
      { id: "purpose2", value: "Communication", order: "2" },
    ],
    tags: [
      { id: "tag1", value: "Productivity", order: "1", color: "#0078D7" },
      { id: "tag2", value: "Teamwork", order: "2", color: "#0078D7" },
    ],
    version: "1.5.00.8070",
    status: "active",
    icon: "/placeholder.svg",
    documentationUrl: "https://docs.microsoft.com/en-us/microsoftteams/",
    supportContact: [
      { id: "email", value: "support@microsoft.com", order: "1" },
    ],
    license: [{ id: "commercial", value: "Commercial", order: "1" }],
    compatiblePlatforms: ["Windows", "macOS", "iOS", "Android", "Web"],
    systemRequirements: "Windows 10 or later, macOS 10.14 or later",
    countries: [{ id: "country1", value: "USA", order: "1" }],
    repositoryUrl: "https://github.com/microsoft/teams",
    collaborationType: [{ id: "type1", value: "Proprietary", order: "1" }],
    documents: [
      { name: "User Guide", url: "https://example.com/teams-user-guide.pdf" },
    ],
    teamSize: 500,
    primaryFocus: [{ id: "focus1", value: "Communication", order: "1" }],
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
    deletedAt: null,
    deletedBy: null,
  },
  {
    id: 2,
    name: "Slack",
    description: "Business communication platform",
    url: "https://slack.com",
    groupId: "group1",
    purposes: [
      { id: "purpose1", value: "Communication", order: "1" },
      { id: "purpose2", value: "Collaboration", order: "2" },
    ],
    tags: [
      { id: "tag1", value: "Messaging", order: "1", color: "#36C5F0" },
      { id: "tag2", value: "Teamwork", order: "2", color: "#36C5F0" },
    ],
    version: "4.0.0",
    status: "active",
    icon: "/placeholder.svg",
    documentationUrl: "https://slack.com/help",
    supportContact: [{ id: "email", value: "feedback@slack.com", order: "1" }],
    license: [{ id: "freemium", value: "Freemium", order: "1" }],
    compatiblePlatforms: ["Windows", "macOS", "iOS", "Android", "Web"],
    systemRequirements: "Modern web browser",
    countries: [{ id: "country1", value: "USA", order: "1" }],
    repositoryUrl: "https://github.com/slackapi",
    collaborationType: [{ id: "type1", value: "Cloud-Based", order: "1" }],
    documents: [
      { name: "API Documentation", url: "https://api.slack.com/docs" },
    ],
    teamSize: 1000,
    primaryFocus: [
      { id: "focus1", value: "Business Communication", order: "1" },
    ],
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
    deletedAt: null,
    deletedBy: null,
  },
];

type ViewMode = "cards" | "table" | "list";

interface ToolsPageProps {
  className?: string;
}

export function ToolsPage({ className = "" }: ToolsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderTools = () => {
    switch (viewMode) {
      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCardMediumComponent
                key={tool.id}
                tool={tool}
                onFavoriteChange={function (isFavorite: boolean): void {
                  throw new Error("Function not implemented.");
                }}
                allowedTags={[]}
              />
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
                  <th className="text-left p-2">Version</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool) => (
                  <tr key={tool.id}>
                    <td className="p-2">{tool.name}</td>
                    <td className="p-2">{tool.description}</td>
                    <td className="p-2">{tool.version}</td>
                    <td className="p-2">{tool.status}</td>
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
                  Version: {tool.version} | Status: {tool.status}
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
        <Input
          type="text"
          placeholder="Search tools..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-64"
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
    example: <ToolsPage />,
  },
];

export default ToolsPage;
