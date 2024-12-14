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
  name: z.string().describe("Name of the Tool Group"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the Tool Group"),
  translations: z.object({}).passthrough().optional().describe("Translations"),
  status: z.string().optional().describe("Status of the Tool Group"),
  metadata: z.object({}).passthrough().optional().describe("Metadata"),
});

export const tablename = "toolgroup";
