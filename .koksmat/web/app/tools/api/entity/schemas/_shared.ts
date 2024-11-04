import { z } from "zod";

export const SharedAttributes = z.object({
  id: z.number().describe("Unique identifier"),
  createdAt: z.date().describe("Creation timestamp"),
  createdBy: z
    .string()

    .describe("ID of the user who created this entity"),
  updatedAt: z.date().describe("Last update timestamp"),
  updatedBy: z
    .string()

    .describe("ID of the user who last updated this entity"),
  deletedAt: z.date().nullable().describe("Deletion timestamp, if applicable"),
  deletedBy: z
    .string()

    .nullable()
    .describe("ID of the user who deleted this entity, if applicable"),
});
