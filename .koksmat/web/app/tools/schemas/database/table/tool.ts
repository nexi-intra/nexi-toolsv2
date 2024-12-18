/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: true
---
*/

import { Translation } from "next-i18next";
import { z } from "zod";
import { translationsSchema } from "../../_shared";

export const schema = z.object({
  tenant: z.string().optional().describe("Tenant"),
  searchindex: z.string().optional().describe("Search Index"),
  name: z.string().describe("Name of the tool\nMake a short and clear title"),
  description: z
    .string()
    // .nullable()
    // .optional()
    .describe(
      "Description of the tool\nNote that you can add links for documentation in other formats"
    ),
  translations: translationsSchema,
  category_id: z.number().int().describe("Category ID"),
  url: z.string().url().describe("URL of the tool"),
  icon: z.string().url().describe("Icon of the tool"),
  //status: z.string().optional().describe("Status of the tool"),
  Documents: z.object({}).passthrough().optional().describe("Documents"),
  metadata: z.object({}).passthrough().optional().describe("Metadata"),
});

export const tablename = "tool";
