'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesIconUploader } from '@/components/icon-uploader';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesIconUploader
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
