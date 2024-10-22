'use client';


import { OpenApiGeneratorComponent } from '@/components/app-components-open-api-generator';
import { EntityCodeExamplesComponent } from '@/components/app-documentation-entity-code-examples';
import React, { } from 'react';




// Example usage
export default function ExampleUsage() {

  return (
    <div><OpenApiGeneratorComponent />
      <EntityCodeExamplesComponent />
    </div>)
}

