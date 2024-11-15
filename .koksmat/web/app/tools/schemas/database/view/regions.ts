import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes } from "../../_shared";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM region order by name`,
  schema: SharedAttributes.extend({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().optional(),
    translations: z.string().optional(),

    sortorder: z.string().optional(),
  }),
  parameters: {},
};
