
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesToolCard } from '@/components/tool-card';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolCard
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
