/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: true
---
*/

import { z } from "zod";
import { translationsSchema } from "../../_shared";

export const schema = z
  .object({
    tenant: z.string().optional().describe("Tenant"),
    searchindex: z.string().optional().describe("Search Index"),
    name: z.string().describe("Name of the purpose"),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("Description of the purpose"),
    translations: translationsSchema,
    sortOrder: z.string().optional(),
  })
  .describe("Sort order");

export const tablename = "purpose";
