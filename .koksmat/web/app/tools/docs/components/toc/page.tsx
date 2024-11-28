'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';


import { examplesTableOfContents } from '@/components/TableOfContents';

// Example usageff
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesTableOfContents,]

  return <ComponentDocumentationHub components={componentDocs} />;
};
