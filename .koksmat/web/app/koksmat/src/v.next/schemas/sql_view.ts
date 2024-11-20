import { z, ZodObject } from "zod";

// // Define the main schema
// export const sqlViewSchema = z.object({
//   sql: z.string(), // Required string
//   databaseName: z.string(), // Required string
//   parameters: z.record(z.string()).optional(), // Optional map of string to string
//   schema: z.instanceof(z.ZodSchema), // Required Zod schema instance
// });

// export type SqlView1 = z.infer<typeof sqlViewSchema>;

export type SqlView = {
  sql: string;
  databaseName: string;
  parameters?: Record<string, string>;
  schema: ZodObject<Record<string, z.ZodTypeAny>>;
};

export type SqlAction = {
  functionName: string;
  databaseName: string;
  //  parameters?: Record<string, string>;
  inputSchema: ZodObject<Record<string, z.ZodTypeAny>>;
  outputSchema: ZodObject<Record<string, z.ZodTypeAny>>;
};
