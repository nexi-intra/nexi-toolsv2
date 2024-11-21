'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesSchemaForm } from '@/app/koksmat/src/v.next/components/generic-schema-form';

// Example usageff
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesSchemaForm
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
