import { SqlAction } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes } from "../../_shared";

export const createOrUpdateTool: SqlAction = {
  databaseName: "tools",
  functionName: `create_or_update_tool_view`,
  inputSchema: z.object({}).catchall(z.any()),
  outputSchema: SharedAttributes.extend({
    trace_data: z.object({}).catchall(z.any()),
    affected_records: z.object({
      name: z.string(),
      type: z.string(),
      count: z.number(),
      table: z.string(),
    }),
  }),
};
