
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesToolCardMedium } from './tool-card-medium';






// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolCardMedium
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
