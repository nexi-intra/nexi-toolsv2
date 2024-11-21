import { SqlView } from "@/app/koksmat/src/v.next/schemas/sql_view";
import * as z from "zod";

import { SharedAttributes } from "../../_shared";
export const ToolSchema = SharedAttributes.extend({
  searchindex: z.string().nullable().describe(`searchIndex`),
  is_favorite: z.boolean().describe(`isFavorite`),
  calculatedsearchindex: z
    .string()
    .nullable()
    .describe(`calculatedSearchIndex`),
  description: z.string().nullable().optional().describe(`Tool description`),
  translations: z.string().nullable().optional().describe(`Tool translations`),
  category_id: z.number().describe(`Category id`),
  url: z.string().describe(`Tool url`),
  status: z.string().describe(`Tool status`),
  icon: z.string().nullable().optional().describe(`Icon`),
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
      icon_reference: z.string().nullable().optional(),
    })
    .describe(`Tool metadata`),
  category_name: z.string().describe(`Category name`),
  category_order: z.string().nullable().describe(`Category order`),
  category_color: z.string().nullable().describe(`Category color`),
  countries: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .nullable()
    .describe(`Countries`),
  languages: z.array(z.any()).nullable().describe(`Languages`),
  purposes: z.array(z.any()).nullable().describe(`Purposes`),
});

export const metadata: SqlView = {
  databaseName: "tools",
  sql: `
  SELECT 
    t.*,
    (get_m2m_right_json(t.id, 'tool', 'country')) AS countries,
    (get_m2m_right_json(t.id, 'tool', 'purpose')) AS purposes,
    (get_m2m_right_json(t.id, 'tool', 'language')) AS languages,
    true AS is_favorite,
    t.name || ' ' || t.description AS calculatedsearchindex,
    c.name AS category_name,
    c.sortorder AS category_order,
    c.color AS category_color
FROM tool AS t
LEFT JOIN category AS c ON c.id = t.category_id
INNER JOIN userprofile_m2m_tool AS umt ON umt.tool_id = t.id
INNER JOIN userprofile AS up ON up.id = umt.userprofile_id
WHERE up.email = '###UPN###' -- Parameter for user's email
ORDER BY t.name
`,
  schema: ToolSchema,
  parameters: {},
};
