'use client';

import React, { } from 'react';
import { examplesToolLarge } from '@/components/tool-large';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';




// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolLarge
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
