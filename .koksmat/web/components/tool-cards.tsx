import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for demonstration
const allTools = [
  { id: 1, name: "SharePoint", description: "Collaborate and manage your content" },
  { id: 2, name: "OneDrive", description: "Store and sync your files" },
  { id: 3, name: "Teams", description: "Chat, meet, and collaborate" },
  { id: 4, name: "Power Apps", description: "Create custom business applications" },
  { id: 5, name: "Power BI", description: "Analyze and visualize your data" },
  { id: 6, name: "Planner", description: "Organize your team's tasks" },
]

type ToolCardsProps = {
  searchQuery: string
}

export default function ToolCards({ searchQuery }: ToolCardsProps) {
  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredTools.map((tool) => (
        <Card key={tool.id}>
          <CardHeader>
            <CardTitle>{tool.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tool.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

