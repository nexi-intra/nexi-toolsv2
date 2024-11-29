import { ComponentDoc } from "./component-documentation-hub"


export const SUGGESTED_FILE = 'fileSystem.ts'
export const SUGGESTED_DISPLAYNAME = 'File System Actions'

export const examplesFileSystem: ComponentDoc[] = [
  {
    id: 'FileSystemOperations',
    name: 'File System Operations',
    description: 'A set of server-side actions for file system operations, including component scanning, documentation generation, and OpenAPI definition generation.',
    usage: `
import { fileSystem } from './app-actions-fileSystem'
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

// Get current working directory
const cwd = await fileSystem.getCwd()

// Read a file
const content = await fileSystem.readFile('/path/to/file.txt')

// Write to a file
await fileSystem.writeFile('/path/to/file.txt', 'Hello, World!')

// Check if a file exists
const exists = await fileSystem.fileExists('/path/to/file.txt')

// Scan a component
const componentInfo = await fileSystem.scanComponent('/path/to/component.tsx')

// Generate documentation for a component
const docInfo = await fileSystem.generateDocumentation('/path/to/component.tsx')

// Generate OpenAPI definition for file system API
const registry = new OpenAPIRegistry()
await fileSystem.generateFileSystemApiOpenApiDefinition(registry)

// Handle a file system request (for use in API routes)
const response = await fileSystem.handleFileSystemRequest(request, { params: { slug: ['readfile', 'path', 'to', 'file.txt'] } })
    `,
    example: (
      <div>
        <h2>File System Operations</h2>
        <p>This module provides various file system operations, including component scanning, documentation generation, and OpenAPI definition generation for the file system API.</p>
        <p>It also includes a handler for API requests, making it easy to create file system related API endpoints.</p>
        <p>Please see the usage example in the code for how to use these actions.</p>
      </div>
    ),
  },
]