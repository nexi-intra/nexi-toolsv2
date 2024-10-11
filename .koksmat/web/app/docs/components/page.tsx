'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolLarge } from '@/components/tool-large';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';


// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    {
      id: 'toolLarge',
      name: 'ToolLarge',
      description: 'The ToolLarge component is a versatile tool display element with toggle and click functionality.',
      usage: `import { ToolLarge } from "@/components/tool-large"

<ToolLarge
  weburl="https://github.com/nexi-intra"
  title="Nexi Intra GitHub repo"
  description="Welcome to the Nexi Digital Workspace! As we embark on a transformative journey to streamline business operations, our small but mighty team is poised to revolutionize how we approach productivity and workflow management. Our core team consists of two dedicated developers and one adept colleague focusing on monitoring. Together, we are committed to developing a comprehensive portfolio of business productivity applications."
  badge="Badge"
  isfavourite={false}
  toggleFavourite={() => {
    // Handle favourite toggle
  }}
  onClick={() => {
    // Handle click action
  }}
/>`,
      props: [
        { name: 'weburl', description: 'URL for the tool' },
        { name: 'title', description: 'Title of the tool' },
        { name: 'description', description: 'Description of the tool' },
        { name: 'badge', description: 'Badge text for the tool' },
        { name: 'isfavourite', description: 'Boolean indicating if the tool is a favourite' },
        { name: 'toggleFavourite', description: 'Function to handle favourite toggling' },
        { name: 'onClick', description: 'Function to handle click action' },
      ],
      example: (
        <ToolLarge
          weburl="https://github.com/nexi-intra"
          title="Nexi Intra GitHub repo"
          description="Welcome to the Nexi Digital Workspace! As we embark on a transformative journey to streamline business operations, our small but mighty team is poised to revolutionize how we approach productivity and workflow management. Our core team consists of two dedicated developers and one adept colleague focusing on monitoring. Together, we are committed to developing a comprehensive portfolio of business productivity applications."
          badge="Example"
          isfavourite={false}
          toogleFavourite={() => alert('Favourite toggled!')}
          onClick={() => alert('Tool clicked!')}
        />
      ),
    },
    // You can add more component documentations here
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
