'use client';

import React, { } from 'react';
import { examples } from '@/components/tool-miniature';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';




// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examples
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
