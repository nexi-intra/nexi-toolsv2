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
  name: z.string().describe("Name of the user"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("Description of the user"),
  Translations: z.object({}).passthrough().optional().describe("Translations"),
  email: z.string().email().describe("Email of the user"),
  firstname: z.string().describe("First name of the user"),
  lastname: z.string().describe("Last name of the user"),
  language_id: z.number().int().describe("Language reference"),
  country_id: z.number().int().describe("Country reference"),
  region_id: z.number().int().describe("Region reference"),
  status: z.string().describe("Status of the user"),
});

export const tablename = "userprofile";
