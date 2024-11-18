import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";
import { ToolView } from "../..";
import { SharedAttributes } from "../../_shared";

export const ToolSchema = SharedAttributes.extend({
  searchindex: z.string().nullable().describe(`searchIndex`),
  description: z.string().nullable().optional().describe(`Tool description`),
  translations: z.string().nullable().optional().describe(`Tool translations`),
  category_id: z.number().describe(`Category id`),
  url: z.string().describe(`Tool url`),
  status: z.string().describe(`Tool status`),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
      })
    )
    .nullable()

    .describe(`Tool documents`),
  metadata: z
    .object({
      icon_reference: z.string(),
    })
    .describe(`Tool metadata`),
  category_name: z.string().describe(`Category name`),
  category_order: z.string().nullable().describe(`Category order`),
  category_color: z.string().nullable().describe(`Category color`),
  countries: z.array(z.any()).nullable().describe(`Countries`),
  purposes: z.array(z.any()).nullable().describe(`Purposes`),
});
export const metadata: SqlView = {
  databaseName: "tools",
  sql: `
  SELECT 
    t.*,
       (get_m2m_left_json(t.id, 'tool', 'country')) AS countries,
       (get_m2m_left_json(t.id, 'tool', 'purpose')) AS purposes,
       
    t.name || ' ' || t.description AS calculatedSearchIndex,
    c.name AS category_name,
    c.sortorder AS category_order,
    c.color AS category_color
 
FROM tool AS t
LEFT JOIN category AS c ON c.id = t.category_id
ORDER BY t.name
`,
  schema: ToolSchema,
  parameters: {},
};
