/*---
koksmat: true
version: 1
---*/
"use client";

import { https, Result } from "@/app/koksmat0/httphelper";
import { z, ZodObject } from "zod";

import { run } from "@/app/koksmat0/magicservices";
import { APPNAME } from "@/app/global";

export const version = 1;

export interface ProcessProps {
  database: string;
  servicename: string;
  processname: string;
  payload: any;
  onError?: (error: any) => void;
  onSuccess?: (response: any) => void;
  onMounted?: (ExecutionTracer: JSX.Element) => void;
}
export async function execute(
  token: string,
  database: string,
  servicename: string,
  processname: string,
  payload: object
): Promise<Result<string>> {
  const args = [
    "execute",
    database,
    processname,
    token,
    JSON.stringify(payload, null, 2),
  ];

  const response: any = await https<string>(
    token,
    "POST",
    "/" + APPNAME + "/api/run",
    {
      args,
      channel: servicename,
      timeout: 600,
    }
  );

  const result: Result<string> = {
    data: response.data,
    hasError: response.error,
    errorMessage: response.error,
  };

  return result;
}

function generateCreateMethod(
  database: string,
  table: string,
  _schema: ZodObject<any, any>
) {
  return async function create<T>(authtoken: string, input: T) {
    const item = _schema.safeParse(input);
    if (!item.success) {
      throw new Error(
        item.error.errors.map((err: { message: any }) => err.message).join(", ")
      );
    }
    const dbrecord = { ...item.data, tenant: "", searchindex: "" };
    const result = await execute(
      authtoken,
      database,
      "magic-mix.app",
      `create_${table}`,
      dbrecord
    );
    if (result.hasError) {
      throw new Error(result.errorMessage);
    }
    return result.data;
  };
}

function generateUpdateMethod(
  database: string,
  table: string,
  _schema: ZodObject<any, any>
) {
  return async function update<T>(authtoken: string, id: string, input: T) {
    const item = _schema.safeParse(input);
    if (!item.success) {
      throw new Error(
        item.error.errors.map((err: { message: any }) => err.message).join(", ")
      );
    }
    const dbrecord = { ...item.data, id, tenant: "", searchindex: "" };
    const result = await execute(
      authtoken,
      database,
      "magic-mix.app",
      `update_${table}`,
      dbrecord
    );
    if (result.hasError) {
      throw new Error(result.errorMessage);
    }
    return result.data;
  };
}

function generateDeleteMethod(
  database: string,
  table: string,
  _schema: ZodObject<any, any>
) {
  return async function del<T>(authtoken: string, id: string, hard: boolean) {
    // The schema for the DeleteActivitymodel procedure
    const _schema = z
      .object({ id: z.number(), hard: z.boolean() })
      .describe("Delete operation");

    const item = _schema.safeParse({ id, hard });
    if (!item.success) {
      throw new Error(
        item.error.errors.map((err: { message: any }) => err.message).join(", ")
      );
    }
    const dbrecord = { ...item.data };
    const result = await execute(
      authtoken,
      database,
      "magic-mix.app",
      `delete_${table}`,
      dbrecord
    );
    if (result.hasError) {
      throw new Error(result.errorMessage);
    }
    return result.data;
  };
}

function generateRestoreMethod(
  database: string,
  table: string,
  _schema: ZodObject<any, any>
) {
  return async function del<T>(authtoken: string, id: string) {
    const _schema = z.object({ id: z.number() }).describe("Restore operation");

    const item = _schema.safeParse({ id });
    if (!item.success) {
      throw new Error(
        item.error.errors.map((err: { message: any }) => err.message).join(", ")
      );
    }
    const dbrecord = { ...item.data };
    const result = await execute(
      authtoken,
      database,
      "magic-mix.app",
      `undo_delete_${table}`,
      dbrecord
    );
    if (result.hasError) {
      throw new Error(result.errorMessage);
    }
    return result.data;
  };
}

export function generateMethods(
  database: string,
  table: string,
  _schema: ZodObject<any, any>
) {
  return {
    create: generateCreateMethod(database, table, _schema),
    update: generateUpdateMethod(database, table, _schema),
    delete: generateDeleteMethod(database, table, _schema),
    restore: generateRestoreMethod(database, table, _schema),
  };
}
