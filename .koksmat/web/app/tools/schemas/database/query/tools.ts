import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `SELECT t.*,c.name as category_name,c.sortorder as category_order,c.color as category_color FROM tool as t
left join category as c on
c.id = t.category_id`,
  schema: z.object({
    id: z.number(),
    // created_at: z.coerce.date(),
    // created_by: z.string(),
    // updated_at: z.coerce.date(),
    // updated_by: z.coerce.date(),
    // deleted_at: z.coerce.date().optional(),
    // koksmat_masterdataref: z.string().optional(),
    // koksmat_masterdata_id: z.string().optional(),
    // koksmat_masterdata_etag: z.string().optional(),
    // koksmat_compliancetag: z.string().optional(),
    // koksmat_state: z.string().optional(),
    // koksmat_bucket: z.string().optional(),
    // tenant: z.string(),
    searchIndex: z.string(),
    name: z.string().describe(`Tool name`),
    description: z.string().describe(`Tool description`),
    translations: z.string().optional().describe(`Tool translations`),
    category_id: z.number().describe(`Category id`),
    url: z.string().describe(`Tool url`),
    status: z.string().describe(`Tool status`),
    documents: z
      .union([
        z.record(z.any()),
        z.object({
          "MFA - CA Mobile Authenticator App - Registrazione Push": z.string(),
          "MFA - CA Mobile Authenticator App - Registrazione OTP Online":
            z.string(),
          "MFA - CA Mobile Authenticator App - Registrazione OTP Offline":
            z.string(),
        }),
      ])
      .describe(`Tool documents`),
    metadata: z
      .object({
        icon_reference: z.string(),
      })
      .describe(`Tool metadata`),
    category_name: z.string().describe(`Category name`),
    category_order: z.string().describe(`Category order`),
    category_color: z.string().describe(`Category color`),
  }),
  parameters: {},
};
