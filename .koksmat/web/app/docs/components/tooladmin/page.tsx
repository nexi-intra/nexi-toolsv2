'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesToolAdmin } from '@/components/tool-admin';




// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesToolAdmin
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
