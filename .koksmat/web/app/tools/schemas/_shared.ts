import { z } from "zod";

export const SharedAttributes = z.object({
  id: z.number().describe("Unique identifier"),
  name: z.string().describe("Name"),
  created_at: z.coerce.date().describe(`Created date`),
  created_by: z.string().describe(`Created by
    ID of the user who created this entity`),
  updated_at: z.coerce.date().describe(`Updated date`),
  updated_by: z.string().describe(`Updated by
    ID of the user who updated this entity`),
  deleted_at: z.coerce.date().nullable().describe(`Soft deletion date
      If soft deleted, the date of deletion`),
  calculatedSearchIndex: z.string().nullable().optional()
    .describe(`Calculated search index
    optional field that can be used to store a calculated search index`),
  deletedBy: z
    .string()
    .nullable()
    .optional()

    .describe("ID of the user who deleted this entity, if applicable"),
});
