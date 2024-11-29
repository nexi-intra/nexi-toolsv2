
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';


import { examplesSqlQueryEditor } from '@/components/sql-query-editor';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesSqlQueryEditor
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
