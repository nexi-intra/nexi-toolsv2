import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM country `,
  schema: z.object({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    translations: z.string().optional(),
    region_id: z.number(),
    sortorder: z.string().optional(),
  }),
  parameters: {},
};
