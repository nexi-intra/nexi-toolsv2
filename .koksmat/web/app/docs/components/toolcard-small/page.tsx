'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesToolCardMini } from '@/components/tool-card-mini';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolCardMini
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
