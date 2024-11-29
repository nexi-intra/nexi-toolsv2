
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';




import { examplesFrontendDataMapper } from '@/components/frontend-data-mapper';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesFrontendDataMapper
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
