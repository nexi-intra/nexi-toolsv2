
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesTag } from '@/components/tag';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesTag
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
