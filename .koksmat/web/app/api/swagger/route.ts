import { NextResponse } from 'next/server'
import { EntityType } from '../entity/[entity]/types'

export async function GET() {
  const openApiSpec = generateOpenApiSpec()
  return NextResponse.json(openApiSpec)
}

function generateOpenApiSpec() {
  const entityTypes: EntityType[] = ['countries', 'tools', 'purposes', 'tags', 'toolGroups', 'users']

  const paths: Record<string, any> = {}

  entityTypes.forEach(entity => {
    paths[`/api/${entity}`] = {
      get: {
        summary: `Get ${entity}`,
        parameters: [
          {
            name: 'id',
            in: 'query',
            schema: { type: 'string' },
            description: 'ID of the specific item to retrieve',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination',
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: { type: 'integer', default: 10 },
            description: 'Number of items per page',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity}Response`,
                },
              },
            },
          },
        },
      },
      post: {
        summary: `Create ${entity}`,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${entity}`,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity}Response`,
                },
              },
            },
          },
        },
      },
      put: {
        summary: `Update ${entity}`,
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the item to update',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${entity}`,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity}Response`,
                },
              },
            },
          },
        },
      },
      patch: {
        summary: `Partially update ${entity}`,
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the item to update',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${entity}`,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entity}Response`,
                },
              },
            },
          },
        },
      },
      delete: {
        summary: `Delete ${entity}`,
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'ID of the item to delete',
          },
        ],
        responses: {
          '200': {
            description: 'Deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    }
  })

  return {
    openapi: '3.0.0',
    info: {
      title: 'Nexi Tools API',
      version: '1.0.0',
      description: 'API for managing Nexi Tools entities',
    },
    paths,
    components: {
      schemas: {
        Country: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string' },
            continent: { type: 'string' },
            currency: { type: 'string' },
            phoneCode: { type: 'string' },
          },
        },
        Tool: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            groupId: { type: 'string' },
            purposeIds: { type: 'array', items: { type: 'string' } },
            tagIds: { type: 'array', items: { type: 'string' } },
            version: { type: 'string' },
            lastUpdated: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'deprecated'] },
          },
        },
        Purpose: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            color: { type: 'string' },
          },
        },
        ToolGroup: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            parentGroupId: { type: 'string', nullable: true },
          },
        },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'user', 'guest'] },
            countryId: { type: 'string' },
            lastLogin: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
          },
        },
        countriesResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Country' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Country' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        toolsResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Tool' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Tool' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        purposesResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Purpose' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Purpose' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        tagsResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/Tag' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/Tag' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        toolGroupsResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/ToolGroup' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/ToolGroup' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        usersResponse: {
          type: 'object',
          properties: {
            data: {
              oneOf: [
                { $ref: '#/components/schemas/User' },
                {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    totalCount: { type: 'integer' },
                    page: { type: 'integer' },
                    pageSize: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              ],
            },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
      },
    },
  }
}