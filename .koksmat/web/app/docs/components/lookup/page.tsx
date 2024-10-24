
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesKeyValueSelector } from '@/components/lookup';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesKeyValueSelector
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
