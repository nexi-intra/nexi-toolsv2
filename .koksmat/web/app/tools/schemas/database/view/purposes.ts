import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { SharedAttributes, translationsSchema } from "../../_shared";
import translations from "@/components/tool-card-medium";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT * FROM purpose WHERE deleted_at IS NULL order by name`,
  schema: SharedAttributes.extend({
    searchindex: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    translations: translationsSchema,

    sortorder: z.string().nullable().optional(),
  }),
  parameters: [],
};
