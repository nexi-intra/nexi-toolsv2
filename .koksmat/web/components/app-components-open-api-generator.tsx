'use client'

import React, { useState, useEffect } from 'react'
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod'
import {
  ToolSchema,
  CountrySchema,
  PurposeSchema,
  TagSchema,
  ToolGroupSchema,
  UserSchema,
  CreateToolInputSchema,
  UpdateToolInputSchema,
  CreateCountryInputSchema,
  UpdateCountryInputSchema,
  CreatePurposeInputSchema,
  UpdatePurposeInputSchema,
  CreateTagInputSchema,
  UpdateTagInputSchema,
  CreateToolGroupInputSchema,
  UpdateToolGroupInputSchema,
  CreateUserInputSchema,
  UpdateUserInputSchema
} from '@/app/api/entity/[...slug]/types'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Call this once in your app's entry point
extendZodWithOpenApi(z);

export function OpenApiGeneratorComponent() {
  const [openApiSpec, setOpenApiSpec] = useState('')

  useEffect(() => {
    generateOpenApiSpec()
  }, [])

  const generateOpenApiSpec = () => {
    const registry = new OpenAPIRegistry()
    const schemaMap: { [key: string]: z.ZodTypeAny } = {};


    // Using an object as a schema map
    schemaMap['Tool'] = registry.register('Tool', ToolSchema.openapi({ title: 'Tool' }));
    schemaMap['Country'] = registry.register('Country', CountrySchema.openapi({ title: 'Country' }));
    schemaMap['Purpose'] = registry.register('Purpose', PurposeSchema.openapi({ title: 'Purpose' }));
    schemaMap['Tag'] = registry.register('Tag', TagSchema.openapi({ title: 'Tag' }));
    schemaMap['ToolGroup'] = registry.register('ToolGroup', ToolGroupSchema.openapi({ title: 'ToolGroup' }));
    schemaMap['User'] = registry.register('User', UserSchema.openapi({ title: 'User' }));

    // Register input schemas
    schemaMap['CreateToolInput'] = registry.register('CreateToolInput', CreateToolInputSchema.openapi({ title: 'CreateToolInput' }));
    schemaMap['UpdateToolInput'] = registry.register('UpdateToolInput', UpdateToolInputSchema.openapi({ title: 'UpdateToolInput' }));
    schemaMap['CreateCountryInput'] = registry.register('CreateCountryInput', CreateCountryInputSchema.openapi({ title: 'CreateCountryInput' }));
    schemaMap['UpdateCountryInput'] = registry.register('UpdateCountryInput', UpdateCountryInputSchema.openapi({ title: 'UpdateCountryInput' }));
    schemaMap['CreatePurposeInput'] = registry.register('CreatePurposeInput', CreatePurposeInputSchema.openapi({ title: 'CreatePurposeInput' }));
    schemaMap['UpdatePurposeInput'] = registry.register('UpdatePurposeInput', UpdatePurposeInputSchema.openapi({ title: 'UpdatePurposeInput' }));
    schemaMap['CreateTagInput'] = registry.register('CreateTagInput', CreateTagInputSchema.openapi({ title: 'CreateTagInput' }));
    schemaMap['UpdateTagInput'] = registry.register('UpdateTagInput', UpdateTagInputSchema.openapi({ title: 'UpdateTagInput' }));
    schemaMap['CreateToolGroupInput'] = registry.register('CreateToolGroupInput', CreateToolGroupInputSchema.openapi({ title: 'CreateToolGroupInput' }));
    schemaMap['UpdateToolGroupInput'] = registry.register('UpdateToolGroupInput', UpdateToolGroupInputSchema.openapi({ title: 'UpdateToolGroupInput' }));
    schemaMap['CreateUserInput'] = registry.register('CreateUserInput', CreateUserInputSchema.openapi({ title: 'CreateUserInput' }));
    schemaMap['UpdateUserInput'] = registry.register('UpdateUserInput', UpdateUserInputSchema.openapi({ title: 'UpdateUserInput' }));


    // Define paths
    const entities = ['tool', 'country', 'purpose', 'tag', 'toolGroup', 'user']
    entities.forEach(entity => {
      const singularEntity = entity //.slice(0, -1)
      const capitalizedEntity = singularEntity.charAt(0).toUpperCase() + singularEntity.slice(1)
      const entitySchema = schemaMap[capitalizedEntity];
      if (!entitySchema) {
        throw new Error(`Schema for ${capitalizedEntity} not found.`);
      }
      const createEntitySchema = schemaMap[`Create${capitalizedEntity}Input`];
      if (!createEntitySchema) {
        throw new Error(`Schema for Create${capitalizedEntity}Input not found.`);
      }
      const updateEntitySchema = schemaMap[`Update${capitalizedEntity}Input`];
      if (!updateEntitySchema) {
        throw new Error(`Schema for Update${capitalizedEntity}Input not found.`);
      }

      registry.registerPath({
        method: 'get',
        path: `/api/entity/${entity}`,
        summary: `Get all ${entity}`,
        request: {
          query: z.object({
            page: z.number().optional(),
            pageSize: z.number().optional(),
          }),
        },
        responses: {
          200: {
            description: `Successfully retrieved ${entity}`,
            content: {
              'application/json': {
                schema: registry.register(`${capitalizedEntity}ListResponse`, z.object({
                  data: z.object({

                    items: z.array(entitySchema),
                    totalCount: z.number(),
                    page: z.number(),
                    pageSize: z.number(),
                    totalPages: z.number(),
                  }),
                  message: z.string(),
                  success: z.boolean(),
                })),
              },
            },
          },
        },
      })

      registry.registerPath({
        method: 'get',
        path: `/api/entity/${entity}/{id}`,
        summary: `Get a specific ${singularEntity}`,
        request: {
          params: z.object({
            id: z.string(),
          }),
        },
        responses: {
          200: {
            description: `Successfully retrieved ${singularEntity}`,
            content: {
              'application/json': {
                schema: registry.register(`${capitalizedEntity}Response`, z.object({
                  data: entitySchema, // Updated here
                  message: z.string(),
                  success: z.boolean(),
                })),
              },
            },
          },
        },
      })

      registry.registerPath({
        method: 'post',
        path: `/api/entity/${entity}`,
        summary: `Create a new ${singularEntity}`,
        request: {
          body: {
            content: {
              'application/json': {
                schema: createEntitySchema, // Updated here
              },
            },
          },
        },
        responses: {
          201: {
            description: `Successfully created ${singularEntity}`,
            content: {
              'application/json': {
                schema: entitySchema, // Updated here
              },
            },
          },
        },
      })

      registry.registerPath({
        method: 'put',
        path: `/api/entity/${entity}/{id}`,
        summary: `Update a ${singularEntity}`,
        request: {
          params: z.object({
            id: z.string(),
          }),
          body: {
            content: {
              'application/json': {
                schema: updateEntitySchema, // Updated here
              },
            },
          },
        },
        responses: {
          200: {
            description: `Successfully updated ${singularEntity}`,
            content: {
              'application/json': {
                schema: entitySchema, // Updated here
              },
            },
          },
        },
      })

      registry.registerPath({
        method: 'delete',
        path: `/api/entity/${entity}/{id}`,
        summary: `Delete a ${singularEntity}`,
        request: {
          params: z.object({
            id: z.string(),
          }),
        },
        responses: {
          200: {
            description: `Successfully deleted ${singularEntity}`,
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  message: z.string(),
                }),
              },
            },
          },
        },
      })
    })

    const generator = new OpenApiGeneratorV3(registry.definitions)

    const spec = generator.generateDocument({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Nexi Tools API',
        description: 'API for managing Nexi Tools entities',
      },
      servers: [{ url: 'https://api.nexitools.com/v1' }],
    })

    setOpenApiSpec(JSON.stringify(spec, null, 2))
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(openApiSpec)
      .then(() => alert('OpenAPI specification copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAPI Specification Generator</h1>
      <Button onClick={generateOpenApiSpec} className="mb-4">Generate OpenAPI Spec</Button>
      <Button onClick={handleCopyToClipboard} className="ml-2 mb-4">Copy to Clipboard</Button>
      <Textarea
        value={openApiSpec}
        readOnly
        className="w-full h-[600px] font-mono text-sm"
      />
    </div>
  )
}
