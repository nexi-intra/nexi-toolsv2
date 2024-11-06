
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesLogViewer } from '@/components/streaming-logviewer';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesLogViewer
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
