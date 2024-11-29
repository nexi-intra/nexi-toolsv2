
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';



import { examplesExcelUploader } from '@/app/koksmat/src/v.next/components/upload-xls';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesExcelUploader
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
