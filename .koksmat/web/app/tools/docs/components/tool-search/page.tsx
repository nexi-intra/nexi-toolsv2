'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesToolSearch } from '@/components/tool-search';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolSearch
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
