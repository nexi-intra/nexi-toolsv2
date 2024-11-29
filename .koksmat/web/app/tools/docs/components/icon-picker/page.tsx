'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesIconPicker } from '@/components/icon-picker';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesIconPicker
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
