import { NextRequest, NextResponse } from "next/server";
import { natsBackendServiceFactory } from "../backend-service";
import { mockBackendServiceFactory } from "../mock-backend-service";
import { BackendService } from "../BackendService";
import { kError, kInfo, kVerbose } from "@/lib/koksmat-logger-client";

type BackendServiceFactory = () => BackendService;

interface ErrorResponse {
  error: string;
  statusCode: number;
}

/**
 * GetBackendServiceFactory
 *
 * This function determines which backend service factory to use based on the
 * USE_MOCK_BACKEND environment variable.
 */
function getBackendServiceFactory(): BackendServiceFactory {
  const useMockBackend = process.env.USE_MOCK_BACKEND === "true";
  return useMockBackend ? mockBackendServiceFactory : natsBackendServiceFactory;
}

// Get the appropriate service factory based on the environment
const serviceFactory: BackendServiceFactory = getBackendServiceFactory();

function handleError(error: unknown): NextResponse<ErrorResponse> {
  kError("An error occurred:", error);
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  return NextResponse.json(
    { error: errorMessage, statusCode: 500 },
    { status: 500 }
  );
}

// GET handler for retrieving all entities or a specific entity
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const [entityType, id] = params.slug;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const service = serviceFactory();
    kVerbose(`Fetching entities of type ${entityType}`);
    if (id) {
      kVerbose(`Fetching entity with id ${id}`);
      const entity = await service.getById(entityType, id);
      return NextResponse.json(entity);
    } else {
      kVerbose(`Fetching all entities `);
      const result = await service.getAll(entityType, page, pageSize);
      return NextResponse.json(result);
    }
  } catch (error) {
    return handleError(error);
  }
}

// POST handler for creating a new entity
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const [entityType] = params.slug;
    const body = await req.json();

    kInfo(`Creating a new entity of type ${entityType}`);
    const service = serviceFactory();
    const newEntity = await service.create(entityType, body);
    kInfo(`Entity created successfully`, newEntity);
    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    kError("An error occurred:", error);
    return handleError(error);
  }
}

// PUT handler for updating an existing entity
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const [entityType, id] = params.slug;
    const body = await req.json();
    kInfo(`Updating entity with id ${id}`);
    const service = serviceFactory();
    const updatedEntity = await service.update(entityType, id, body);
    kInfo(`Entity updated successfully`, updatedEntity);
    return NextResponse.json(updatedEntity);
  } catch (error) {
    kError("An error occurred:", error);
    return handleError(error);
  }
}

// DELETE handler for removing an entity
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const [entityType, id] = params.slug;
    kInfo(`Deleting entity with id ${id}`);
    const service = serviceFactory();
    await service.delete(entityType, id);
    kInfo(`Entity deleted successfully`);
    return NextResponse.json({
      success: true,
      message: "Entity deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}
