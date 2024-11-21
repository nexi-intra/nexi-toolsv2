/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string(),
  searchindex: z.string(),
  name: z.string().describe("Name of the country"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the country"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  region_id: z.number().int().describe("Region ID"),
  sortOrder: z.string().optional().describe("Sort order"),
});

export const tablename = "country";
