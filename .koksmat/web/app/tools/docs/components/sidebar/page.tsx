
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesHLASidebar } from '@/components/components-hla-sidebar';
import { Sidebar_03 } from '@/components/components-sidebar-03';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesHLASidebar
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
