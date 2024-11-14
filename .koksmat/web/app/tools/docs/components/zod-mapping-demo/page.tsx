'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';

import { examplesZodMappingDemo } from '@/components/zod-mapping-demo';

// Example usageff
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesZodMappingDemo];

  return <ComponentDocumentationHub components={componentDocs} />;
};
