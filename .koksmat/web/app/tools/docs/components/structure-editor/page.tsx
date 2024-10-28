
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesOneLineText } from '@/components/one-line-text';
import EnhancedStructureEditor from '@/components/enhanced-structure-editor';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesOneLineText
  ];
  return <EnhancedStructureEditor />;
  return <ComponentDocumentationHub components={componentDocs} />;
};
