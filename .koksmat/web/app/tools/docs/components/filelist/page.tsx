//TODO: Add drag and drop functionality to reorder the files
//TODO: support paste and drop
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesFileLinksGrid } from '@/components/file-links-grid';






// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesFileLinksGrid
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
