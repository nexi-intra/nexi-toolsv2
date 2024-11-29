//TODO: Add drag and drop functionality to reorder the files
//TODO: support paste and drop
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesMultiLanguageTranslator } from '@/components/multi-language-translator';










// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesMultiLanguageTranslator
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
