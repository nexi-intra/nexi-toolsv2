//TODO: Add drag and drop functionality to reorder the files
//TODO: support paste and drop
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesFavorite } from '@/components/favorite';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesFavorite
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
