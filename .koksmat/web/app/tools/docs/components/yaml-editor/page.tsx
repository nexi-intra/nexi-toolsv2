
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import EnhancedStructureEditor from '@/components/tree-editor';
import { examplesYAMLEditor } from '@/components/yaml-editor';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesYAMLEditor,
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
