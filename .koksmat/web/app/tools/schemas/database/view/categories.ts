import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM category order by name`,
  schema: z.object({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    translations: z.string().nullable().optional(),
    sortorder: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
  }),
  parameters: {},
};
