import { SqlAction } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes } from "../../_shared";

export const userprofileFavourite: SqlAction = {
  databaseName: "tools",
  functionName: `userprofile_m2m_tool_manage_view`,
  inputSchema: z
    .object({
      email: z.string(),
      tool_id: z.number(),
      is_favorite: z.boolean(),
    })
    .catchall(z.any()),
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
