
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesEntityDataMapping } from '@/components/data-mapper';

// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesEntityDataMapping
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
