//TODO: Add drag and drop functionality to reorder the files
//TODO: support paste and drop
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesActionCard } from '@/components/action-card';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesActionCard
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
