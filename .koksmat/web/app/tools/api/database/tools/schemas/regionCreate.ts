/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/

import { z } from "zod";

export const CreateRegionSchema = z.object({
  tenant: z.string(),
  searchindex: z.string(),
  name: z.string().describe(`Name of the region
    Use the translation object for translations`),
  description: z.string().optional().describe("Description of the region"),
  Translations: z
    .object({})
    .passthrough()
    .optional()
    .describe("Translations for the region name and description"),
  sortOrder: z.string().optional().describe("Sort order of the region"),
});
export type CreateRegion = z.infer<typeof CreateRegionSchema>;
