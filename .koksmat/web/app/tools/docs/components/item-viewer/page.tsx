'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesItemViewer } from '@/app/koksmat/src/v.next/components/item-viewer';

// Example usageff
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesItemViewer];

  return <ComponentDocumentationHub components={componentDocs} />;
};
