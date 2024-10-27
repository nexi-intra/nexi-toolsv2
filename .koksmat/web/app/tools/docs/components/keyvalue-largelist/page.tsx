
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesLargeListSelector } from '@/components/large-list-selector';








// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesLargeListSelector
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
