
'use client';

import React from 'react';
import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';
import { examplesFileSystem } from '@/components/app-actions-file-system-doc';

export default function FileSystemActionsDocumentation() {
  const componentDocs: ComponentDoc[] = [
    ...examplesFileSystem
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
}
