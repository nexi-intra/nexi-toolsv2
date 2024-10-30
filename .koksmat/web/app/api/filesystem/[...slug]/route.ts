import { fileSystem } from "@/components/app-actions-file-system";
import { NextRequest } from "next/server";

export const GET = (
  request: NextRequest,
  params: { params: { slug: string[] } }
) => fileSystem.handleFileSystemRequest(request, params);

export const POST = (
  request: NextRequest,
  params: { params: { slug: string[] } }
) => fileSystem.handleFileSystemRequest(request, params);
