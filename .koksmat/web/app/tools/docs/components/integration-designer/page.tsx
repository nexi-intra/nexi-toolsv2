
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';



import { examplesIntegrationDesigner } from '@/components/integration-designer';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesIntegrationDesigner
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
