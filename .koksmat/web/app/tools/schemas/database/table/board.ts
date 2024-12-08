/* 
File has been automatically created. To prevent the file from getting overwritten,
set the Front Matter property 'keep' to 'true'. Syntax for the code snippet:
---
keep: false
---
*/

import { z } from "zod";

export const schema = z.object({
  tenant: z.string().optional().describe("Tenant"),
  searchindex: z.string().optional().describe("Search Index"),
  name: z.string().describe("Name of the board"),
  status: z.string().describe("Status of the board"),
  description: z
    .string()
    .nullable()
    .optional()
    .describe("What is the board used for?"),
  layout: z.any().optional().describe("Layout of the board"),

  translations: z
    .object({})
    .passthrough()
    .nullable()
    .optional()
    .describe("Translations"),
});

export const tablename = "board";
