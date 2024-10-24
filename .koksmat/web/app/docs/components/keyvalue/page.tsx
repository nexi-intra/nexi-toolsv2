
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesKeyValueSelector } from '@/components/key-value-selector';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesKeyValueSelector
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
