import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes } from "../../_shared";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM board WHERE deleted_at IS NULL`,
  schema: SharedAttributes.extend({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    layout: z.any().optional(),
  }),
  parameters: [],
};
