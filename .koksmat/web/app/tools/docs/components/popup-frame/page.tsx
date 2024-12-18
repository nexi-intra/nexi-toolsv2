
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesPopupFrame } from '@/components/popup-frame';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesPopupFrame
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
