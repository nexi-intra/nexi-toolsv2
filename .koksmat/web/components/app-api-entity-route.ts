"use client";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * DynamicEntityRoute
 * Handles CRUD operations for various entities using a dynamic route
 * All logic is contained within this file for easy copy-paste deployment
 * Includes API client and entity type definitions with Zod schemas
 * Uses message-oriented approach for backend API communication
 * Supports paging for getAll operations and custom SQL queries
 * Includes a PATCH method for partial updates
 */

// Backend API URL from environment variable
const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "https://api.example.com/v1/operations";
// APPLICATION_KEY is kept server-side and not exposed to the client
const APPLICATION_KEY =
  process.env.APPLICATION_KEY || "default-application-key";

// Zod schemas for entity validation
const baseEntitySchema = z.object({
  id: z.string(),
  createdDate: z.string(),
  createdBy: z.string(),
  updatedDate: z.string(),
  updatedBy: z.string(),
});

const countrySchema = baseEntitySchema.extend({
  name: z.string(),
  code: z.string(),
});

const favouriteSchema = baseEntitySchema.extend({
  userId: z.string(),
  itemId: z.string(),
  itemType: z.string(),
});

const toolSchema = baseEntitySchema.extend({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  groupId: z.string(),
});

const purposeSchema = baseEntitySchema.extend({
  name: z.string(),
  description: z.string(),
});

const tagSchema = baseEntitySchema.extend({
  name: z.string(),
});

const toolGroupSchema = baseEntitySchema.extend({
  name: z.string(),
  description: z.string(),
});

const userSchema = baseEntitySchema.extend({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
});

// Entity type definitions derived from Zod schemas
export type EntityType =
  | "countries"
  | "favourites"
  | "tools"
  | "purposes"
  | "tags"
  | "toolGroups"
  | "users";
export type Country = z.infer<typeof countrySchema>;
export type Favourite = z.infer<typeof favouriteSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type Purpose = z.infer<typeof purposeSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type ToolGroup = z.infer<typeof toolGroupSchema>;
export type User = z.infer<typeof userSchema>;

type EntityTypeMap = {
  countries: Country;
  favourites: Favourite;
  tools: Tool;
  purposes: Purpose;
  tags: Tag;
  toolGroups: ToolGroup;
  users: User;
};

const entitySchemaMap: { [K in EntityType]: z.ZodType<EntityTypeMap[K]> } = {
  countries: countrySchema,
  favourites: favouriteSchema,
  tools: toolSchema,
  purposes: purposeSchema,
  tags: tagSchema,
  toolGroups: toolGroupSchema,
  users: userSchema,
};

// Verify token (replace with actual token verification in production)
function verifyToken(token: string): boolean {
  // Implement actual token verification logic here
  return token === "valid-token";
}

// Helper function to get current user ID (replace with actual implementation)
function getCurrentUserId(): string {
  return "current-user-id";
}

// CRUD operations
async function getAll<T extends EntityType>(
  entity: T,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: EntityTypeMap[T][]; totalCount: number }> {
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "get",
      page,
      pageSize,
    }),
  });
  if (!response.ok) throw new Error("Failed to fetch data");
  const data = await response.json();
  return {
    items: entitySchemaMap[entity]
      .array()
      .parse(data.items) as EntityTypeMap[T][],
    totalCount: z.number().parse(data.totalCount),
  };
}

async function getOne<T extends EntityType>(
  entity: T,
  id: string
): Promise<EntityTypeMap[T] | null> {
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "get",
      identity: id,
    }),
  });
  if (!response.ok) throw new Error("Failed to fetch data");
  const result = await response.json();
  return result.length > 0 ? entitySchemaMap[entity].parse(result[0]) : null;
}

async function create<T extends EntityType>(
  entity: T,
  data: Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>
): Promise<EntityTypeMap[T]> {
  const currentUserId = getCurrentUserId();
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "create",
      attributes: {
        ...data,
        createdBy: currentUserId,
        updatedBy: currentUserId,
      },
    }),
  });
  if (!response.ok) throw new Error("Failed to create data");
  const result = await response.json();
  return entitySchemaMap[entity].parse(result);
}

async function update<T extends EntityType>(
  entity: T,
  id: string,
  data: Partial<Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>>
): Promise<EntityTypeMap[T] | null> {
  const currentUserId = getCurrentUserId();
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "update",
      identity: id,
      attributes: {
        ...data,
        updatedBy: currentUserId,
      },
    }),
  });
  if (!response.ok) throw new Error("Failed to update data");
  const result = await response.json();
  return entitySchemaMap[entity].parse(result);
}

async function remove<T extends EntityType>(
  entity: T,
  id: string
): Promise<boolean> {
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "delete",
      identity: id,
    }),
  });
  if (!response.ok) throw new Error("Failed to delete data");
  return z.boolean().parse(await response.json());
}

async function executeQuery<T>(
  sql: string,
  page: number = 1,
  pageSize: number = 10,
  mapFunction: (row: any) => T
): Promise<{ items: T[]; totalCount: number }> {
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      operation: "query",
      sql,
      page,
      pageSize,
    }),
  });
  if (!response.ok) throw new Error("Failed to execute query");
  const data = await response.json();
  return {
    items: data.items.map(mapFunction),
    totalCount: z.number().parse(data.totalCount),
  };
}

async function patch<T extends EntityType>(
  entity: T,
  id: string,
  data: Partial<Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>>
): Promise<EntityTypeMap[T] | null> {
  const currentUserId = getCurrentUserId();
  const patchData = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));
  const response = await fetch(BACKEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Application-Key": APPLICATION_KEY,
    },
    body: JSON.stringify({
      entity,
      operation: "patch",
      identity: id,
      attributes: patchData,
      updatedBy: currentUserId,
    }),
  });
  if (!response.ok) throw new Error("Failed to patch data");
  const result = await response.json();
  return entitySchemaMap[entity].parse(result);
}

// Request handlers
export async function GET(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!)
    : 10;
  const sql = searchParams.get("sql");

  try {
    if (sql) {
      const result = await executeQuery(sql, page, pageSize, (row) => row);
      return NextResponse.json(result);
    } else if (id) {
      const result = await getOne(params.entity, id);
      if (result) {
        return NextResponse.json(result);
      } else {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    } else {
      const result = await getAll(params.entity, page, pageSize);
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    //TODO: Validate data
    //const validatedData = entitySchemaMap[params.entity].omit(baseEntitySchema.keyof().enum).parse(data)
    const result = await create(params.entity, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError; // Assert the error as ZodError
      return NextResponse.json(
        { error: "Validation error", details: zodError.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const data = await request.json();
    //TODO: Validate data
    //const validatedData = entitySchemaMap[params.entity].partial().omit(baseEntitySchema.keyof().enum).parse(data)
    const result = await update(params.entity, id, data);
    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError; // Assert the error as ZodError
      return NextResponse.json(
        { error: "Validation error", details: zodError.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const result = await remove(params.entity, id);
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { entity: EntityType } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const data = await request.json();
    //TODO: Validate data
    //const validatedData = entitySchemaMap[params.entity].partial().omit(baseEntitySchema.keyof().enum).parse(data)
    const result = await patch(params.entity, id, data);
    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError; // Assert the error as ZodError
      return NextResponse.json(
        { error: "Validation error", details: zodError.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API Client (client-side)
export class ApiClient<T extends EntityType> {
  private entity: T;
  private baseUrl: string;
  private getToken: () => string | Promise<string>;

  constructor(entity: T, getToken: () => string | Promise<string>) {
    this.entity = entity;
    this.baseUrl = `/api/entity/${entity}`;
    this.getToken = getToken;
  }

  private async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await Promise.resolve(this.getToken());
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    return fetch(url, { ...options, headers });
  }

  async getAll(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ items: EntityTypeMap[T][]; totalCount: number }> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return {
      items: entitySchemaMap[this.entity]
        .array()
        .parse(data.items) as EntityTypeMap[T][],
      totalCount: z.number().parse(data.totalCount),
    };
  }

  async getOne(id: string): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return entitySchemaMap[this.entity].parse(data);
  }

  async create(
    data: Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>
  ): Promise<EntityTypeMap[T]> {
    //TODO: Validate data
    //const validatedData = entitySchemaMap[this.entity].omit(baseEntitySchema.keyof().enum).parse(data)
    const response = await this.fetchWithAuth(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create data");
    const result = await response.json();
    return entitySchemaMap[this.entity].parse(result);
  }

  async update(
    id: string,
    data: Partial<
      Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>
    >
  ): Promise<EntityTypeMap[T]> {
    //TODO: Validate data
    //const validatedData = entitySchemaMap[this.entity].partial().omit(baseEntitySchema.keyof().enum).parse(data)
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const result = await response.json();
    return entitySchemaMap[this.entity].parse(result);
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    return z.boolean().parse(await response.json());
  }

  async query<R>(
    sql: string,
    page: number = 1,
    pageSize: number = 10,
    mapFunction: (row: any) => R
  ): Promise<{ items: R[]; totalCount: number }> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}?sql=${encodeURIComponent(
        sql
      )}&page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to execute query");
    const data = await response.json();
    return {
      items: data.items.map(mapFunction),
      totalCount: z.number().parse(data.totalCount),
    };
  }

  async patch(
    id: string,
    data: Partial<
      Omit<EntityTypeMap[T], keyof z.infer<typeof baseEntitySchema>>
    >
  ): Promise<EntityTypeMap[T]> {
    //TODO: Validate data
    //const validatedData = entitySchemaMap[this.entity].partial().omit(baseEntitySchema.keyof().enum).parse(data)
    const response = await this.fetchWithAuth(`${this.baseUrl}?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to patch data");
    const result = await response.json();
    return entitySchemaMap[this.entity].parse(result);
  }
}
