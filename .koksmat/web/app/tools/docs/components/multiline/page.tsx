
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesMultiLineText } from '@/components/multi-line-text';






// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesMultiLineText
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
