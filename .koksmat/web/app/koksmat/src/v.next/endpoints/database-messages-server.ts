import { NextRequest, NextResponse } from "next/server";

import { kError, kVerbose, kWarn } from "@/lib/koksmat-logger-client";
import { run } from "../actions/server";

import { z } from "zod";

export const databaseMessageSchema = z.object({
  //token: z.string(),
  subject: z.string(),
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

    switch (message.subject) {
      case "create":
        const createResult = await run(
          MICROSERVICE,
          [
            "execute",
            message.targetDatabase.databaseName,
            "create_" + message.targetDatabase.tableName,
            token,
            JSON.stringify(message.record.data),
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
            message.targetDatabase.databaseName,
            `select * from ${message.targetDatabase.tableName} where id = ${message.record.id}`,
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
        if (readResult.data?.Result.length !== 1) {
          return new Response(
            JSON.stringify({ error: readResult.errorMessage, status: 404 })
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
            message.targetDatabase.databaseName,
            "update_" + message.targetDatabase.tableName,
            token,
            JSON.stringify(message.record.data),
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
    //const { text, texts, sourceLanguage, targetLanguages } = body;
    //console.log(JSON.stringify(body, null, 2));
    kVerbose("endpoint", "database", "Database request", body);
    return new Response(JSON.stringify({ error: "Not implemented" }));

    const res = await request.json();
    const result = await run<any>(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    let hasError = result.hasError;
    if (hasError) {
      return new Response(JSON.stringify({ error: result.errorMessage }));
    }
    if (!result.data?.Result) {
      return new Response(
        JSON.stringify({
          error: "No error signalled, but empty result returned",
        })
      );
    }

    const returnValue = result.data?.Result;
    return new Response(JSON.stringify(returnValue));
  } catch (error) {
    return Response.error();
  }
}
