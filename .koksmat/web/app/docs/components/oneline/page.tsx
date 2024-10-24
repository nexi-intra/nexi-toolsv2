
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesOneLineText } from '@/components/one-line-text';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesOneLineText
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
