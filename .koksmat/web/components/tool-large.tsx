"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FavouriteIcon } from "./favourite-icon"
import { ArrowUpIcon, FileIcon, GlobeIcon } from "lucide-react"
import { exampleToolInfo, ToolInfo } from "./interfaces/ToolInfo"
import { ComponentDoc } from "./component-documentation-hub"
import Image from "next/image"

/**
 * ToolLarge
 * 
 * A large card component for displaying detailed information about a tool,
 * including its description, associated countries, business purposes, and documents.
 */


export const examplesToolLarge: ComponentDoc[] = [{
  id: 'toolLarge',
  name: 'ToolLarge',
  description: 'The ToolLarge component is a versatile tool display element that showcases detailed information about a tool, including its description, associated countries, business purposes, and related documents.',
  usage: `import ToolLarge, { ToolInfo } from "@/components/tool-large"

const toolInfo: ToolInfo = {
  id: 'nexi-intra-github',
  icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
  name: 'Nexi Intra GitHub repo',
  description: {
    en: 'Welcome to the Nexi Digital Workspace! As we embark on a transformative journey to streamline business operations, our small but mighty team is poised to revolutionize how we approach productivity and workflow management. Our core team consists of two dedicated developers and one adept colleague focusing on monitoring. Together, we are committed to developing a comprehensive portfolio of business productivity applications.'
  },
  countries: ['Italy', 'Denmark', 'Norway'],
  businessPurposes: ['Code Repository', 'Collaboration'],
  documents: [
    { name: 'README', url: 'https://github.com/nexi-intra/README.md' },
    { name: 'Contributing Guidelines', url: 'https://github.com/nexi-intra/CONTRIBUTING.md' }
  ]

};

<ToolLarge
  tool={toolInfo}
  badge="Example"
  isFavourite={false}
  toggleFavourite={() => {
    // Handle favourite toggle
  }}
  onClick={() => {
    // Handle click action
  }}
/>`,
  example: (
    <ToolLarge
      tool={exampleToolInfo}
      badge="Example"
      isFavourite={false}
      toggleFavourite={() => alert('Favourite toggled!')}
      onClick={() => alert('Tool clicked!')}
    />
  ),
}
]
export interface ToolLargeProps {
  tool: ToolInfo;
  badge: string;
  isFavourite: boolean;
  toggleFavourite: () => void;
  onClick: () => void;
}

export function ToolLarge({ tool, badge, isFavourite, toggleFavourite, onClick }: ToolLargeProps) {
  const defaultLanguage = 'en'; // Assuming English as default language

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-[#00d8ff] text-white px-2 py-1 rounded-md">
            {badge}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FavouriteIcon
            onClick={toggleFavourite}
            className="absolute top-2 right-2 w-6 h-6 text-blue-700 cursor-default"
            selected={isFavourite}
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">

        <img className="border" src={tool.icon} alt={tool.name} width={64} height={64} />

        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold">{tool.name}</h2>
          <p className="text-sm text-gray-600">{tool.description[defaultLanguage]}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {tool.countries.map((country, index) => (
          <div key={index} className="flex items-center space-x-2">
            <GlobeIcon className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm font-medium">{country}</p>
            </div>
          </div>
        ))}
        {tool.businessPurposes.map((purpose, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FileIcon className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-sm font-medium">{purpose}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Documents</h3>
        {tool.documents.map((doc, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <FileIcon className="w-6 h-6 text-red-600" />
            <Link href={doc.url} target="_blank" className="text-sm text-blue-600 hover:underline">
              {doc.name}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Button className="bg-blue-600 text-white" onClick={onClick}>OPEN TOOL</Button>
      </div>
    </div>
  )
}