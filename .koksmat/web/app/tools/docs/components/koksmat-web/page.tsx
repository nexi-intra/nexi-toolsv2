'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesKoksmatWebCLIDocs } from '@/components/koksmat-web-cli-docs';






// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesKoksmatWebCLIDocs
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
