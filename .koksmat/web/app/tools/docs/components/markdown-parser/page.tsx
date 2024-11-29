
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';


import { examplesMarkdownEditor } from '@/app/koksmat/src/v.next/components/markdown-editor';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesMarkdownEditor,
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
