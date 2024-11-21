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
  name: z.string().describe("Name of the category"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the category"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  sortOrder: z.string().optional().describe("Sort order"),
  color: z.string().optional(),
}).describe(`
Color code
Color code for the category, supports hex, rgb, rgba, hsl, hsla, and named colors.
`);

export const tablename = "category";
