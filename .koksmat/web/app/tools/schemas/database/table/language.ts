/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: true
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string().optional().describe("Tenant"),
  searchindex: z.string().optional().describe("Search Index"),
  name: z.string().describe("Name of the language"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the language"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  code: z.string().describe("Code of the language"),
  sortOrder: z.string().optional().describe("Sort order"),
});

export const tablename = "language";
