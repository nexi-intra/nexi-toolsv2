
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesActionSelector } from '@/components/action-selector';
import { examplesZeroTrust } from '@/components/zero-trust';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesZeroTrust
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
