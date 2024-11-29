import fs from "fs/promises";
import path from "path";
import { ComponentDoc } from "./component-documentation-hub";
import { APPNAME } from "@/app/global";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

/**
 * This module provides server-side actions for file system operations.
 * It includes functions for getting the current working directory,
 * reading, writing, appending, and deleting files, as well as checking file existence.
 * It also includes functions for scanning components, generating documentation, and handling API requests.
 */

type FileSystemActions = {
  getCwd: { payload: undefined; result: string };
  readFile: { payload: { path: string }; result: string };
  writeFile: {
    payload: { path: string; content: string };
    result: { success: boolean; message: string };
  };
  appendFile: {
    payload: { path: string; content: string };
    result: { success: boolean; message: string };
  };
  deleteFile: {
    payload: { path: string };
    result: { success: boolean; message: string };
  };
  fileExists: { payload: { path: string }; result: boolean };
};

type ActionFunction<T extends keyof FileSystemActions> = (
  payload: FileSystemActions[T]["payload"]
) => Promise<FileSystemActions[T]["result"]>;

const actions: { [K in keyof FileSystemActions]: ActionFunction<K> } = {
  getCwd: async () => process.cwd(),
  readFile: async ({ path }) => fs.readFile(path, "utf-8"),
  writeFile: async ({ path, content }) => {
    await fs.writeFile(path, content);
    return { success: true, message: "File written successfully" };
  },
  appendFile: async ({ path, content }) => {
    await fs.appendFile(path, content);
    return { success: true, message: "Content appended successfully" };
  },
  deleteFile: async ({ path }) => {
    await fs.unlink(path);
    return { success: true, message: "File deleted successfully" };
  },
  fileExists: async ({ path }) => {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  },
};

async function scanComponent(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  let suggestedPath = "";
  let exampleFunc = "";
  let suggestedFile = "";
  let suggestedDisplayName = "";

  for (const line of lines) {
    if (line.includes("export const SUGGESTED_PATH =")) {
      suggestedPath = line
        .split("=")[1]
        .trim()
        .replace(/['"`;]/g, "");
    }
    if (line.match(/export (const|function) examples\w+/)) {
      const match = line.match(/examples\w+/);
      exampleFunc = match ? match[0] : "";
    }
    if (line.includes("export const SUGGESTED_FILE =")) {
      suggestedFile = line
        .split("=")[1]
        .trim()
        .replace(/['"`;]/g, "");
    }
    if (line.includes("export const SUGGESTED_DISPLAYNAME =")) {
      suggestedDisplayName = line
        .split("=")[1]
        .trim()
        .replace(/['"`;]/g, "");
    }
  }

  return { suggestedPath, exampleFunc, suggestedFile, suggestedDisplayName };
}

function getAppName() {
  return APPNAME;
}

async function generateDocumentation(componentPath: string) {
  const { suggestedPath, exampleFunc, suggestedFile, suggestedDisplayName } =
    await scanComponent(componentPath);
  const appName = getAppName();

  if (!suggestedPath) {
    throw new Error("SUGGESTED_PATH not found in the component");
  }

  const docPath = path.join(
    process.cwd(),
    "app",
    appName,
    "docs",
    "components",
    suggestedPath
  );
  const docContent = `'use client';

import React from 'react';

import { ComponentDoc, ComponentDocumentationHub } from './component-documentation-hub';
import { ${exampleFunc} } from '${componentPath.replace(/\\/g, "/")}';

export const SUGGESTED_FILE = '${suggestedFile}';
export const SUGGESTED_DISPLAYNAME = '${suggestedDisplayName}';

// Example usage
export default function ExampleUsage() {
  const componentDocs: ComponentDoc[] = ${exampleFunc} ? [...${exampleFunc}] : [];

  return <ComponentDocumentationHub components={componentDocs} />;
};
`;

  await fs.mkdir(path.dirname(docPath), { recursive: true });
  await fs.writeFile(docPath, docContent);

  return { docPath, componentPath, suggestedFile, suggestedDisplayName };
}

// Helper function to check if we're in a development environment
const isDev = process.env.NODE_ENV === "development";

// Helper function to parse the slug and extract operation and parameters
function parseSlug(slug: string[]): { operation: string; params: string[] } {
  const [operation, ...params] = slug.map((s) => s.toLowerCase());
  return { operation, params };
}

// Main handler function for all file system operations
export async function handleFileSystemRequest(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  // Fail if not in development environment
  if (!isDev) {
    return NextResponse.json(
      { error: "This API is only available in development mode" },
      { status: 403 }
    );
  }

  const { operation, params: slugParams } = parseSlug(params.slug);

  try {
    let result;
    if (request.method === "GET") {
      switch (operation) {
        case "getcwd":
          result = await actions.getCwd(undefined);
          break;
        case "readfile":
          if (slugParams.length < 1) throw new Error("File path is required");
          result = await actions.readFile({ path: slugParams[0] });
          break;
        case "fileexists":
          if (slugParams.length < 1) throw new Error("File path is required");
          result = await actions.fileExists({ path: slugParams[0] });
          break;
        case "scancomponent":
          if (slugParams.length < 1)
            throw new Error("Component path is required");
          result = await scanComponent(slugParams[0]);
          break;
        case "getappname":
          result = getAppName();
          break;
        default:
          return NextResponse.json(
            { error: "Invalid operation" },
            { status: 400 }
          );
      }
    } else if (request.method === "POST") {
      const body = await request.json();
      switch (operation) {
        case "writefile":
          if (slugParams.length < 1) throw new Error("File path is required");
          result = await actions.writeFile({
            path: slugParams[0],
            content: body.content,
          });
          break;
        case "appendfile":
          if (slugParams.length < 1) throw new Error("File path is required");
          result = await actions.appendFile({
            path: slugParams[0],
            content: body.content,
          });
          break;
        case "deletefile":
          if (slugParams.length < 1) throw new Error("File path is required");
          result = await actions.deleteFile({ path: slugParams[0] });
          break;
        case "generatedocumentation":
          if (slugParams.length < 1)
            throw new Error("Component path is required");
          result = await generateDocumentation(slugParams[0]);
          break;
        default:
          return NextResponse.json(
            { error: "Invalid operation" },
            { status: 400 }
          );
      }
    } else {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * Generates the OpenAPI definition for the file system API.
 * @param registry - The OpenAPI registry
 */
export async function generateFileSystemApiOpenApiDefinition(
  registry: OpenAPIRegistry
) {
  const FilePathSchema = z.string().describe("Path to the file");
  const FileContentSchema = z.string().describe("Content of the file");
  const ComponentPathSchema = z.string().describe("Path to the component");

  const FileOperationResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
  });

  const ScanComponentResponseSchema = z.object({
    suggestedPath: z.string(),
    exampleFunc: z.string(),
    suggestedFile: z.string(),
    suggestedDisplayName: z.string(),
  });

  const GenerateDocumentationResponseSchema = z.object({
    docPath: z.string(),
    componentPath: z.string(),
    suggestedFile: z.string(),
    suggestedDisplayName: z.string(),
  });

  registry.register("FileOperationResponse", FileOperationResponseSchema);
  registry.register("ScanComponentResponse", ScanComponentResponseSchema);
  registry.register(
    "GenerateDocumentationResponse",
    GenerateDocumentationResponseSchema
  );

  // GET endpoints
  registry.registerPath({
    method: "get",
    path: "/" + APPNAME + "/api/filesystem/getcwd",
    description: "Get the current working directory",
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/" + APPNAME + "/api/filesystem/readfile/{filePath}",
    description: "Read the contents of a file",
    request: {
      params: z.object({
        filePath: FilePathSchema,
      }),
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/" + APPNAME + "/api/filesystem/fileexists/{filePath}",
    description: "Check if a file exists",
    request: {
      params: z.object({
        filePath: FilePathSchema,
      }),
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: z.boolean(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/" + APPNAME + "/api/filesystem/scancomponent/{componentPath}",
    description: "Scan a component file for metadata",
    request: {
      params: z.object({
        componentPath: ComponentPathSchema,
      }),
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: ScanComponentResponseSchema,
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/" + APPNAME + "/api/filesystem/getappname",
    description: "Get the application name",
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: z.string(),
            }),
          },
        },
      },
    },
  });

  // POST endpoints
  registry.registerPath({
    method: "post",
    path: "/" + APPNAME + "/api/filesystem/writefile/{filePath}",
    description: "Write content to a file",
    request: {
      params: z.object({
        filePath: FilePathSchema,
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              content: FileContentSchema,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: FileOperationResponseSchema,
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/" + APPNAME + "/api/filesystem/appendfile/{filePath}",
    description: "Append content to a file",
    request: {
      params: z.object({
        filePath: FilePathSchema,
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              content: FileContentSchema,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: FileOperationResponseSchema,
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/" + APPNAME + "/api/filesystem/deletefile/{filePath}",
    description: "Delete a file",
    request: {
      params: z.object({
        filePath: FilePathSchema,
      }),
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: FileOperationResponseSchema,
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path:
      "/" + APPNAME + "/api/filesystem/generatedocumentation/{componentPath}",
    description: "Generate documentation for a component",
    request: {
      params: z.object({
        componentPath: ComponentPathSchema,
      }),
    },
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: z.object({
              result: GenerateDocumentationResponseSchema,
            }),
          },
        },
      },
    },
  });
}

// Extended fileSystem object with new functions
export const fileSystem = {
  getCwd: () => actions.getCwd(undefined),
  readFile: (path: string) => actions.readFile({ path }),
  writeFile: (path: string, content: string) =>
    actions.writeFile({ path, content }),
  appendFile: (path: string, content: string) =>
    actions.appendFile({ path, content }),
  deleteFile: (path: string) => actions.deleteFile({ path }),
  fileExists: (path: string) => actions.fileExists({ path }),
  scanComponent: (path: string) => scanComponent(path),
  getAppName: () => getAppName(),
  generateDocumentation: (path: string) => generateDocumentation(path),
  generateFileSystemApiOpenApiDefinition: (registry: OpenAPIRegistry) =>
    generateFileSystemApiOpenApiDefinition(registry),
  handleFileSystemRequest: (
    request: NextRequest,
    params: { params: { slug: string[] } }
  ) => handleFileSystemRequest(request, params),
};
