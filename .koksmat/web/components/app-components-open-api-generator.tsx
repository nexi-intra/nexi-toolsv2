//'use client'

import React, { useState, useEffect } from 'react'
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod'

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { APPNAME } from '@/app/global'
import { createInputSchema, schemaMapObjects, SchemaName, typeNames, updateInputSchema } from '@/app/tools/schemas/forms'

// Call this once in your app's entry point
extendZodWithOpenApi(z);
/**
 * Represents a callback function that accepts an OpenAPIRegistry as its parameter.
 * This function is used to register schemas, paths, or other OpenAPI elements to the registry.
 */
export type ApiRegistryCallback = (registry: OpenAPIRegistry) => void;

/**
 * Represents an array of ApiRegistryCallback functions.
 * This can be used to collect multiple callback functions that will operate on the same OpenAPIRegistry.
 */
export type ApiRegistryCallbacks = ApiRegistryCallback[];
export interface GenerateTranslationApiOpenApiDefinition {
  /**
   * Generates the OpenAPI definition for the Translation API.
   * 
   * @param registry - An existing OpenAPIRegistry to which the Translation API schemas and paths will be added.
   * @returns The complete OpenAPI definition as a JavaScript object.
   */
  (registry: OpenAPIRegistry): void;
}


export function OpenApiGeneratorComponent({ server, addionalEndpoints }: { server: string, addionalEndpoints?: ApiRegistryCallbacks }) {
  //const [openApiSpec, setOpenApiSpec] = useState('')

  // useEffect(() => {
  //   generateOpenApiSpec()
  // }, [])

  const generateOpenApiSpec = () => {
    const registry = new OpenAPIRegistry()

    if (addionalEndpoints) {
      addionalEndpoints.forEach((callback) => {
        callback(registry)
      })
    }

    const schemaMap: { [key: string]: z.ZodTypeAny } = {};

    Object.entries(typeNames).forEach(([schemaName, typeName]) => {
      schemaMap[typeName] = registry.register(typeName, schemaMapObjects[schemaName as SchemaName].openapi({ title: typeName }));
      schemaMap[`Create${typeName}Input`] = registry.register(`Create${typeName}Input`,
        createInputSchema(schemaMapObjects[schemaName as SchemaName]).openapi({ title: `Create${typeName}Input` }));
      schemaMap[`Update${typeName}Input`] = registry.register(`Update${typeName}Input`,
        updateInputSchema(schemaMapObjects[schemaName as SchemaName]).openapi({ title: `Update${typeName}Input` }));


    });
    // // Using an object as a schema map
    // schemaMap['Tool'] = registry.register('Tool', ToolSchema.openapi({ title: 'Tool' }));
    // schemaMap['Country'] = registry.register('Country', CountrySchema.openapi({ title: 'Country' }));
    // schemaMap['Purpose'] = registry.register('Purpose', PurposeSchema.openapi({ title: 'Purpose' }));
    // schemaMap['Tag'] = registry.register('Tag', TagSchema.openapi({ title: 'Tag' }));
    // schemaMap['ToolGroup'] = registry.register('ToolGroup', ToolGroupSchema.openapi({ title: 'ToolGroup' }));
    // schemaMap['User'] = registry.register('User', UserSchema.openapi({ title: 'User' }));

    // // Register input schemas
    // schemaMap['CreateCountryInput'] = registry.register('CreateCountryInput', CreateCountryInputSchema.openapi({ title: 'CreateCountryInput' }));
    // schemaMap['UpdateCountryInput'] = registry.register('UpdateCountryInput', UpdateCountryInputSchema.openapi({ title: 'UpdateCountryInput' }));
    // schemaMap['CreatePurposeInput'] = registry.register('CreatePurposeInput', CreatePurposeInputSchema.openapi({ title: 'CreatePurposeInput' }));
    // schemaMap['UpdatePurposeInput'] = registry.register('UpdatePurposeInput', UpdatePurposeInputSchema.openapi({ title: 'UpdatePurposeInput' }));
    // schemaMap['CreateTagInput'] = registry.register('CreateTagInput', CreateTagInputSchema.openapi({ title: 'CreateTagInput' }));
    // schemaMap['UpdateTagInput'] = registry.register('UpdateTagInput', UpdateTagInputSchema.openapi({ title: 'UpdateTagInput' }));
    // schemaMap['CreateToolGroupInput'] = registry.register('CreateToolGroupInput', CreateToolGroupInputSchema.openapi({ title: 'CreateToolGroupInput' }));
    // schemaMap['UpdateToolGroupInput'] = registry.register('UpdateToolGroupInput', UpdateToolGroupInputSchema.openapi({ title: 'UpdateToolGroupInput' }));
    // schemaMap['CreateUserInput'] = registry.register('CreateUserInput', CreateUserInputSchema.openapi({ title: 'CreateUserInput' }));
    // schemaMap['UpdateUserInput'] = registry.register('UpdateUserInput', UpdateUserInputSchema.openapi({ title: 'UpdateUserInput' }));


    // Define paths
    const entities = ['tool', 'country', 'purpose', 'tag', 'toolGroup', 'user']
    Object.entries(typeNames).forEach(([schemaName, typeName]) => {
      const singularEntity = schemaName //.slice(0, -1)
      const capitalizedEntity = typeName //singularEntity.charAt(0).toUpperCase() + singularEntity.slice(1)
      const entitySchema = schemaMap[capitalizedEntity];
      if (!entitySchema) {
        throw new Error(`Schema for ${capitalizedEntity} not found.`);
      }
      // const createEntitySchema = schemaMap[`Create${capitalizedEntity}Input`];
      // if (!createEntitySchema) {
      //   throw new Error(`Schema for Create${capitalizedEntity}Input not found.`);
      // }
      // const updateEntitySchema = schemaMap[`Update${capitalizedEntity}Input`];
      // if (!updateEntitySchema) {
      //   throw new Error(`Schema for Update${capitalizedEntity}Input not found.`);
      // }

      registry.registerPath({
        method: 'get',
        path: `/${APPNAME}/api/entity/${schemaName}`,
        summary: `Get all ${schemaName}`,
        request: {
          query: z.object({
            page: z.number().optional(),
            pageSize: z.number().optional(),
          }),
        },
        responses: {
          200: {
            description: `Successfully retrieved ${schemaName}`,
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
        path: `/${APPNAME}/api/entity/${schemaName}/{id}`,
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

      // registry.registerPath({
      //   method: 'post',
      //   path: `/${APPNAME}/api/entity/${schemaName}`,
      //   summary: `Create a new ${singularEntity}`,
      //   request: {
      //     body: {
      //       content: {
      //         'application/json': {
      //           schema: createEntitySchema, // Updated here
      //         },
      //       },
      //     },
      //   },
      //   responses: {
      //     201: {
      //       description: `Successfully created ${singularEntity}`,
      //       content: {
      //         'application/json': {
      //           schema: entitySchema, // Updated here
      //         },
      //       },
      //     },
      //   },
      // })

      // registry.registerPath({
      //   method: 'put',
      //   path: `/${APPNAME}/api/entity/${schemaName}/{id}`,
      //   summary: `Update a ${singularEntity}`,
      //   request: {
      //     params: z.object({
      //       id: z.string(),
      //     }),
      //     body: {
      //       content: {
      //         'application/json': {
      //           schema: updateEntitySchema, // Updated here
      //         },
      //       },
      //     },
      //   },
      //   responses: {
      //     200: {
      //       description: `Successfully updated ${singularEntity}`,
      //       content: {
      //         'application/json': {
      //           schema: entitySchema, // Updated here
      //         },
      //       },
      //     },
      //   },
      // })

      // registry.registerPath({
      //   method: 'delete',
      //   path: `/${APPNAME}/api/entity/${schemaName}/{id}`,
      //   summary: `Delete a ${singularEntity}`,
      //   request: {
      //     params: z.object({
      //       id: z.string(),
      //     }),
      //   },
      //   responses: {
      //     200: {
      //       description: `Successfully deleted ${singularEntity}`,
      //       content: {
      //         'application/json': {
      //           schema: z.object({
      //             success: z.boolean(),
      //             message: z.string(),
      //           }),
      //         },
      //       },
      //     },
      //   },
      // })
    })

    const generator = new OpenApiGeneratorV3(registry.definitions)

    const spec = generator.generateDocument({
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Magic Links API',
        description: 'API for managing Magic Links entities',
      },
      servers: [{ url: server }],
    })

    return JSON.stringify(spec, null, 2)
  }

  // const handleCopyToClipboard = () => {
  //   navigator.clipboard.writeText(openApiSpec)
  //     .then(() => alert('OpenAPI specification copied to clipboard!'))
  //     .catch(err => console.error('Failed to copy: ', err))
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OpenAPI Specification Generator</h1>
      {/* <Button onClick={generateOpenApiSpec} className="mb-4">Generate OpenAPI Spec</Button>
      <Button onClick={handleCopyToClipboard} className="ml-2 mb-4">Copy to Clipboard</Button> */}
      <Textarea
        value={generateOpenApiSpec()}
        readOnly
        className="w-full h-[600px] font-mono text-sm"
      />
    </div>
  )
}
