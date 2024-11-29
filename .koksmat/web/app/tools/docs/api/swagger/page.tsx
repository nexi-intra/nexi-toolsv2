

/**
 * ExampleUsageComponent
 * 
 * This component demonstrates the usage of OpenApiGeneratorComponent and EntityCodeExamplesComponent,
 * with the OpenApiGeneratorComponent dynamically receiving the current host as its server prop.
 * The rendering waits for the currentHost to be set before displaying the OpenApiGeneratorComponent.
 */

import { OpenApiGeneratorComponent } from '@/components/app-components-open-api-generator';
import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"

import { generateTranslationApiOpenApiDefinition } from '@/lib/translation-service';
import { headers } from 'next/headers';
import { generateFileSystemApiOpenApiDefinition } from '@/components/app-actions-file-system';
export default function ExampleUsage() {


  // Access the incoming request headers
  const headersList = headers();
  // Retrieve the 'host' header
  const host = headersList.get('host') || 'Unknown host';

  return (
    <div className="space-y-6 p-6">
      {host ? (
        <OpenApiGeneratorComponent server={host}
          addionalEndpoints={[generateTranslationApiOpenApiDefinition]} />
      ) : (
        <Skeleton className="w-full h-[200px] rounded-lg" />
      )}

    </div>
  );
}