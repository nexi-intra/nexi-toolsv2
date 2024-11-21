import { NextRequest, NextResponse } from "next/server";

import { kError, kVerbose, kWarn } from "@/lib/koksmat-logger-client";
import { run } from "../actions/server";

import { z } from "zod";
import { queries } from "@/app/global";
import { database } from "@/actions/database/works/activityModel";
import { databaseActions } from "@/app/tools/schemas/database";
import { jwtDecode } from "jwt-decode";

const crudOperationSchema = z.object({
  messageType: z.literal("crudOperation"),
  targetDatabase: z.object({
    databaseName: z.string(),
    tableName: z.string(),
    isVirtual: z.boolean(),
  }),
  record: z.object({
    id: z.number().optional(),
    data: z.record(z.any()).optional(),
    hardDelete: z.boolean().optional(),
  }),
});

const queryOperationSchema = z.object({
  messageType: z.literal("query"),
  name: z.string(),
  parameters: z.record(z.any()).optional(),
});
const actionOperationSchema = z.object({
  messageType: z.literal("action"),
  name: z.string(),
  parameters: z.record(z.any()).optional(),
});
export const databaseMessageSchema = z.object({
  subject: z.string(),
  message: z.discriminatedUnion("messageType", [
    crudOperationSchema,
    queryOperationSchema,
    actionOperationSchema,
  ]),
});
export type DatabaseMessageType = z.infer<typeof databaseMessageSchema>;
const MICROSERVICE = "magic-mix.app";
export async function handleDatabaseMessagesServer(request: NextRequest) {
  try {
    const body = await request.json();
    kVerbose("endpoint", "Database request", body);
    const req = databaseMessageSchema.safeParse(body);
    const bearerToken = request.headers.get("Authorization") || "";
    const token = bearerToken.split("Bearer ")[1];

    if (!req.success) {
      kError("endpoint", __filename, req.error);
    } else {
      kVerbose("endpoint", "Validation successful!", req.data);
    }
    if (!req.data) {
      kError("endpoint", __filename, "No data");
      return new Response(JSON.stringify({ error: "No data" }));
    }
    const message = req.data;
    if (message.message.messageType === "crudOperation") {
      switch (message.subject) {
        case "create":
          const createResult = await run(
            MICROSERVICE,
            [
              "execute",
              message.message.targetDatabase.databaseName,
              "create_" + message.message.targetDatabase.tableName,
              token,
              JSON.stringify(message.message.record.data),
            ],
            "",
            600,
            "x"
          );
          if (createResult.hasError) {
            return new Response(
              JSON.stringify({ error: createResult.errorMessage, status: 503 })
            );
          }
          return new Response(JSON.stringify({ ...createResult, status: 200 }));
          break;
        case "delete":
          break;
        case "patch":
          break;

        case "read":
          const readResult = await run<{ Result: any[] }>(
            MICROSERVICE,
            [
              "query",
              message.message.targetDatabase.databaseName,
              `select * from ${message.message.targetDatabase.tableName} where id = ${message.message.record.id}`,
              // token,
              // JSON.stringify(message.record.data),
            ],
            "",
            600,
            "x"
          );
          if (readResult.hasError) {
            return new Response(
              JSON.stringify({ error: readResult.errorMessage, status: 503 })
            );
          }
          if (!readResult.data?.Result) {
            return new Response(
              JSON.stringify({ error: "Item not found", status: 404 })
            );
          }
          if (readResult.data?.Result.length !== 1) {
            return new Response(
              JSON.stringify({ error: readResult.errorMessage, status: 504 })
            );
          }
          return new Response(
            JSON.stringify({ record: readResult.data?.Result[0], status: 200 })
          );

          break;
        case "undo_delete":
          break;
        case "update":
          const updateResult = await run(
            MICROSERVICE,
            [
              "execute",
              message.message.targetDatabase.databaseName,
              "update_" + message.message.targetDatabase.tableName,
              token,
              JSON.stringify(message.message.record.data),
            ],
            "",
            600,
            "x"
          );
          if (updateResult.hasError) {
            return new Response(
              JSON.stringify({ error: updateResult.errorMessage, status: 503 })
            );
          }
          return new Response(JSON.stringify({ ...updateResult, status: 200 }));
          break;

        default:
          break;
      }
    } else if (message.message.messageType === "query") {
      const databaseQuery = queries.getView(message.message.name as any);
      if (!databaseQuery) {
        return new Response(
          JSON.stringify({ error: "Query not found", status: 404 })
        );
      }

      kVerbose("endpoint", "databaseQuery", databaseQuery);
      const jwt = jwtDecode<{ upn: string }>(token);
      const queryResult = await run<{ Result: any[] }>(
        MICROSERVICE,
        [
          "query",
          databaseQuery.databaseName,
          databaseQuery.sql.replaceAll("###UPN###", jwt.upn ?? ""),
          JSON.stringify(message.message.parameters),
        ],
        "",
        600,
        "x"
      );
      if (queryResult.hasError) {
        kError("endpoint", "Query error", queryResult.errorMessage);
        return new Response(
          JSON.stringify({ error: queryResult.errorMessage, status: 503 })
        );
      }

      return new Response(JSON.stringify({ ...queryResult, status: 200 }));
    } else if (message.message.messageType === "action") {
      const databaseAction = databaseActions.getAction(
        message.message.name as any
      );
      if (!databaseAction) {
        return new Response(
          JSON.stringify({ error: "Action not found", status: 404 })
        );
      }

      kVerbose("endpoint", "databaseAction", databaseAction);
      const queryResult = await run<{ Result: any[] }>(
        MICROSERVICE,
        [
          "execute",
          databaseAction.databaseName,
          databaseAction.functionName,
          token,
          JSON.stringify(message.message.parameters),
        ],
        "",
        600,
        "x"
      );
      if (queryResult.hasError) {
        kError("endpoint", "Query error", queryResult.errorMessage);
        return new Response(
          JSON.stringify({ error: queryResult.errorMessage, status: 503 })
        );
      }

      return new Response(JSON.stringify({ ...queryResult, status: 200 }));
    }
  } catch (error) {
    return Response.error();
  }
}
