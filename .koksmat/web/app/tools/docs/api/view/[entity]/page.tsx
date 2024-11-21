'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import CodeSamplesPage from '@/components/code-samples-page';

import ZodSchemaDocumentation from '@/components/zod-schema-documentation';
import { schemaMapObjects, SchemaName, typeNames } from '@/app/tools/schemas/forms';


export default function EntityCodeSamplePage(props: { params: { entity: string } }) {

  const { entity } = props.params;
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{typeNames[entity as SchemaName]} </h1>
      <code>
        import {typeNames[entity as SchemaName]} from &apos;@/app/tools/api/entity/schemas&apos;
      </code>
      <div className='pr-48'>
        <ZodSchemaDocumentation schema={schemaMapObjects[entity as SchemaName]} name={entity} typename={typeNames[entity as SchemaName]} />
      </div>
      <CodeSamplesPage schema={schemaMapObjects[entity as SchemaName]} entityName={entity} />
    </div>
  );
}