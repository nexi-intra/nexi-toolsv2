import { z } from "zod";
import { APPNAME } from "@/app/global";
import { SchemaMap, schemaMapTypes, SchemaName } from "../../schemas/forms";

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class DatabaseClient<T extends SchemaName> {
  private entity: T;
  private baseUrl: string;
  private getToken: () => string | Promise<string>;
  private schema: z.ZodType<SchemaMap[T]>;

  constructor(entity: T, getToken: () => string | Promise<string>) {
    this.entity = entity;
    this.baseUrl = `/api/${APPNAME}/view/${entity}`;
    this.getToken = getToken;
    this.schema = schemaMapTypes[entity];
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
  ): Promise<PaginatedResponse<SchemaMap[T]>> {
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

  async getOne(id: string): Promise<SchemaMap[T]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return data;
    //return this.schema.parse(data);
  }

  // async create(
  //   data: Omit<SchemaMap[T], keyof z.infer<typeof SharedAttributes>>
  // ): Promise<SchemaMap[T]> {
  //   const response = await this.fetchWithAuth(this.baseUrl, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) throw new Error("Failed to create data");
  //   const responseData = await response.json();
  //   return responseData;
  //   //return this.schema.parse(responseData);
  // }

  // async update(id: string, data: Partial<SchemaMap[T]>): Promise<SchemaMap[T]> {
  //   const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) throw new Error("Failed to update data");
  //   const responseData = await response.json();
  //   return responseData;
  //   //return this.schema.parse(responseData);
  // }

  // async patch(id: string, data: Partial<SchemaMap[T]>): Promise<SchemaMap[T]> {
  //   const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
  //     method: "PATCH",
  //     body: JSON.stringify(data),
  //   });
  //   if (!response.ok) throw new Error("Failed to patch data");
  //   const responseData = await response.json();
  //   return responseData;
  //   //return this.schema.parse(responseData);
  // }

  // async delete(id: string): Promise<boolean> {
  //   const response = await this.fetchWithAuth(`${this.baseUrl}/${id}`, {
  //     method: "DELETE",
  //   });
  //   if (!response.ok) throw new Error("Failed to delete data");
  //   return response.json();
  // }

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
