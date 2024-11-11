import { NextRequest, NextResponse } from "next/server";

import { kError, kVerbose, kWarn } from "@/lib/koksmat-logger-client";
import { run } from "../actions/server";

import { z } from "zod";

const schema = z.object({
  //token: z.string(),
  subject: z.string(),
  targetData: z.object({
    table: z.string(),
    isVirtual: z.boolean(),
  }),
  payload: z.object({
    data: z.record(z.any()),
  }),
});
const MICROSERVICE = "magic-mix.app";
export async function handleDatabaseMessagesServer(request: NextRequest) {
  try {
    const body = await request.json();
    kVerbose("endpoint", "Database request", body);
    const req = schema.safeParse(body);
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
    const data = req.data;

    switch (data.subject) {
      case "create":
        const payload = { ...data.payload.data, tenant: "", searchindex: "" };
        const result = await run(
          MICROSERVICE,
          [
            "execute",
            "tools",
            "create_" + data.targetData.table,
            token,
            JSON.stringify(payload),
          ],
          "",
          600,
          "x"
        );
        if (result.hasError) {
          return new Response(
            JSON.stringify({ error: result.errorMessage, status: 503 })
          );
        }
        return new Response(JSON.stringify({ ...result, status: 200 }));
        break;
      case "delete":
        break;
      case "patch":
        break;
      case "read":
        break;
      case "undo_delete":
        break;
      case "update":
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
