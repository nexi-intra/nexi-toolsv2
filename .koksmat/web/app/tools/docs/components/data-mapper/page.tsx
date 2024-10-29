
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesOneLineText } from '@/components/one-line-text';
import EnhancedStructureEditor from '@/components/tree-editor';
import { ComprehensiveDataMappingExampleComponent } from '@/components/comprehensive-data-mapping-example';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesOneLineText
  ];
  return <ComprehensiveDataMappingExampleComponent />;
  return <ComponentDocumentationHub components={componentDocs} />;
};
