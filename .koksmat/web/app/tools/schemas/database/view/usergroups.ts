import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes } from "../../_shared";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM usergroup order by name`,
  schema: SharedAttributes.extend({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    translations: z.string().nullable().optional(),

    sortorder: z.string().nullable().optional(),
  }),
  parameters: {},
};
