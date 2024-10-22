'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import CodeSamplesPage from '@/components/code-samples-page';
import { schemaMapObjects, SchemaName, typeNames } from '@/app/api/entity/schemas';

export default function EntityCodeSamplePage(props: { params: { entity: string } }) {

  const { entity } = props.params;
  return (
    <div className="space-y-6 p-6">

      <CodeSamplesPage schema={schemaMapObjects[entity as SchemaName]} entityName={entity} />
    </div>
  );
}