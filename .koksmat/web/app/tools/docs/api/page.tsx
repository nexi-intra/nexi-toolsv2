'use client';

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
import CodeSamplesPage from '@/components/code-samples-page';
import { schemaMapObjects, typeNames } from '@/app/tools/schemas';
import { APILandingPage } from '@/components/app-api-page';

export default function ExampleUsage() {
  const [currentHost, setCurrentHost] = useState<string | null>(null);

  useEffect(() => {
    // Set the current host when the component mounts
    setCurrentHost(window.location.origin);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <APILandingPage />
    </div>
  );
}