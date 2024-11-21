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
  name: z.string().describe("Name of the event"),
  description: z.string().nullable().optional().describe("n.a."),
  Translations: z.object({}).passthrough().optional().describe("n.a."),
  user_id: z.number().int().describe("User ID"),
  tool_id: z.number().int().describe("Tool ID"),
  metadata: z.object({}).passthrough().optional(),
});

export const tablename = "event";
