'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesYamlTreeEditor } from '@/components/yaml-tree-editor';





// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesYamlTreeEditor
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
