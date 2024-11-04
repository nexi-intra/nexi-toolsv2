
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesTokenInput } from '@/components/token-input';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesTokenInput
  ];
  return <ComponentDocumentationHub components={componentDocs} />;
};
