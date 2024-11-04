
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesSimplifiedMonacoInputField } from '@/components/simplified-monaco-input-field';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesSimplifiedMonacoInputField
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
