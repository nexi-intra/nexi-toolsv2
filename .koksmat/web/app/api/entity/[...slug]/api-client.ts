import { z } from "zod";
import {
  Tool,
  Country,
  Purpose,
  Tag,
  ToolGroup,
  User,
  ToolSchema,
  CountrySchema,
  PurposeSchema,
  TagSchema,
  ToolGroupSchema,
  UserSchema,
} from "./types";
import { SharedAttributes } from "./types/_shared";

type EntityType = "tool" | "country" | "purpose" | "tag" | "toolGroup" | "user";

type EntityTypeMap = {
  tool: Tool;
  country: Country;
  purpose: Purpose;
  tag: Tag;
  toolGroup: ToolGroup;
  user: User;
};

const SchemaMap: { [K in EntityType]: z.ZodType<EntityTypeMap[K]> } = {
  tool: ToolSchema,
  country: CountrySchema,
  purpose: PurposeSchema,
  tag: TagSchema,
  toolGroup: ToolGroupSchema,
  user: UserSchema,
};

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ApiClient<T extends EntityType> {
  private entity: T;
  private baseUrl: string;
  private getToken: () => string | Promise<string>;
  private schema: z.ZodType<EntityTypeMap[T]>;

  constructor(entity: T, getToken: () => string | Promise<string>) {
    this.entity = entity;
    this.baseUrl = `http://localhost:4997/api/entity/${entity}`;
    this.getToken = getToken;
    this.schema = SchemaMap[entity];
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
  ): Promise<PaginatedResponse<EntityTypeMap[T]>> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}?page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return {
      ...data,
      //items: data.items.map((item: any) => this.schema.parse(item)),
    };
  }

  async getOne(id: string): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return this.schema.parse(data);
  }

  async create(
    data: Omit<EntityTypeMap[T], keyof z.infer<typeof SharedAttributes>>
  ): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create data");
    const responseData = await response.json();
    return this.schema.parse(responseData);
  }

  async update(
    id: string,
    data: Partial<EntityTypeMap[T]>
  ): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
    const responseData = await response.json();
    return this.schema.parse(responseData);
  }

  async patch(
    id: string,
    data: Partial<EntityTypeMap[T]>
  ): Promise<EntityTypeMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to patch data");
    const responseData = await response.json();
    return this.schema.parse(responseData);
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete data");
    return response.json();
  }

  async query<R>(
    sql: string,
    page: number = 1,
    pageSize: number = 10,
    mapFunction: (row: any) => R
  ): Promise<PaginatedResponse<R>> {
    const response = await this.fetchWithAuth(
      `${this.baseUrl}/query?sql=${encodeURIComponent(
        sql
      )}&page=${page}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to execute query");
    const data = await response.json();
    return {
      items: data.items.map(mapFunction),
      totalCount: data.totalCount,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    };
  }
}
