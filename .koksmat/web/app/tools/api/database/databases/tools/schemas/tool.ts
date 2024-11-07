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
  name: z.string().describe("Name of the tool"),
  description: z.string().optional().describe("Description of the tool"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  category_id: z.number().int().describe("Category ID"),
  url: z.string().describe("URL of the tool"),
  status: z.string().optional().describe("Status of the tool"),
  Documents: z.object({}).passthrough().optional().describe("Documents"),
  metadata: z.object({}).passthrough().optional().describe("Metadata"),
});

export const tablename = "tool";
