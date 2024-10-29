
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesActionSelector } from '@/components/action-selector';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesActionSelector
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
