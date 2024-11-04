
'use client';

import React, { } from 'react';

import { ComponentDoc, ComponentDocumentationHub } from '@/components/component-documentation-hub';


import { examplesTwoPanelWithToc } from '@/components/two-panel-with-toc';







// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = [
    ...examplesTwoPanelWithToc
  ];

  return <ComponentDocumentationHub components={componentDocs} />;
};
