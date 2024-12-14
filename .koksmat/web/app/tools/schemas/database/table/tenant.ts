/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string().optional().describe("Tenant"),
  searchindex: z.string().optional().describe("Search Index"),
  name: z.string().describe("Name of the tenant"),
  status: z.string().describe("Status of the tenant"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the tenant"),
  translations: z
    .object({})
    .passthrough()
    .nullable()
    .optional()
    .describe("Translations"),
});

export const tablename = "tenant";
