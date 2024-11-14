/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: true
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string(),
  searchindex: z.string(),
  name: z.string().describe("Name of the Tool Group"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the Tool Group"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  status: z.string().optional().describe("Status of the Tool Group"),
  metadata: z.object({}).passthrough().optional().describe("Metadata"),
});

export const tablename = "toolgroup";
