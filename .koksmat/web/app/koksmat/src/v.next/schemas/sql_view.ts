import { z } from "zod";

// Define the main schema
export const sqlViewSchema = z.object({
  sql: z.string(), // Required string
  databaseName: z.string(), // Required string
  parameters: z.record(z.string()).optional(), // Optional map of string to string
  schema: z.instanceof(z.ZodSchema), // Required Zod schema instance
});

export type SqlView = z.infer<typeof sqlViewSchema>;
