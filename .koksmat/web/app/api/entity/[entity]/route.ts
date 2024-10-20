import { NextRequest, NextResponse } from 'next/server'
import { MessageHandler } from './message-handler'
import { EntityType, EntityTypeMap, BackendServiceFactory, PaginatedResponse, ApiResponse, ErrorResponse } from './types'
import { backendServiceFactory } from './backend-service'
import { mockBackendServiceFactory } from './mock-backend-service'

/**
 * GetBackendServiceFactory
 * 
 * This function determines which backend service factory to use based on the
 * USE_MOCK_BACKEND environment variable.
 */
function getBackendServiceFactory(): BackendServiceFactory {
  const useMockBackend = process.env.USE_MOCK_BACKEND === 'true'
  return useMockBackend ? mockBackendServiceFactory : backendServiceFactory
}

// Get the appropriate service factory based on the environment
const serviceFactory: BackendServiceFactory = getBackendServiceFactory()

function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error('An error occurred:', error)
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
  return NextResponse.json({ error: errorMessage, statusCode: 500 }, { status: 500 })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
): Promise<NextResponse<ApiResponse<EntityTypeMap[EntityType] | PaginatedResponse<EntityTypeMap[EntityType]>> | ErrorResponse>> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  const backendService = serviceFactory.getService(params.entity)
  const messageHandler = new MessageHandler(params.entity, backendService)

  try {
    const result = await messageHandler.handleMessage({
      type: 'READ',
      entity: params.entity,
      payload: { id, page, pageSize }
    })
    return NextResponse.json({ data: result, message: 'Data retrieved successfully', success: true })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
): Promise<NextResponse<ApiResponse<EntityTypeMap[EntityType]> | ErrorResponse>> {
  const backendService = serviceFactory.getService(params.entity)
  const messageHandler = new MessageHandler(params.entity, backendService)

  try {
    const data = await request.json()
    const result = await messageHandler.handleMessage({
      type: 'CREATE',
      entity: params.entity,
      payload: data
    })
    return NextResponse.json({ data: result, message: 'Data created successfully', success: true }, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
): Promise<NextResponse<ApiResponse<EntityTypeMap[EntityType]> | ErrorResponse>> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required', statusCode: 400 }, { status: 400 })
  }

  const backendService = serviceFactory.getService(params.entity)
  const messageHandler = new MessageHandler(params.entity, backendService)

  try {
    const data = await request.json()
    const result = await messageHandler.handleMessage({
      type: 'UPDATE',
      entity: params.entity,
      payload: { id, data }
    })
    return NextResponse.json({ data: result, message: 'Data updated successfully', success: true })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
): Promise<NextResponse<ApiResponse<EntityTypeMap[EntityType]> | ErrorResponse>> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required', statusCode: 400 }, { status: 400 })
  }

  const backendService = serviceFactory.getService(params.entity)
  const messageHandler = new MessageHandler(params.entity, backendService)

  try {
    const data = await request.json()
    const result = await messageHandler.handleMessage({
      type: 'PATCH',
      entity: params.entity,
      payload: { id, data }
    })
    return NextResponse.json({ data: result, message: 'Data patched successfully', success: true })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
): Promise<NextResponse<ApiResponse<boolean> | ErrorResponse>> {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required', statusCode: 400 }, { status: 400 })
  }

  const backendService = serviceFactory.getService(params.entity)
  const messageHandler = new MessageHandler(params.entity, backendService)

  try {
    const result = await messageHandler.handleMessage({
      type: 'DELETE',
      entity: params.entity,
      payload: { id }
    })
    return NextResponse.json({ data: result, message: 'Data deleted successfully', success: true })
  } catch (error) {
    return handleError(error)
  }
}