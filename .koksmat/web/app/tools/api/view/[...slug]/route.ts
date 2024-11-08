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
