import { z } from "zod";
import {
  createInputSchema,
  updateInputSchema,
  responseSchema,
  listResponseSchema,
} from ".";
import { SharedAttributes } from "./_shared";

export const PurposeSchema = SharedAttributes.extend({
  name: z.string().describe("Name of the purpose"),
  description: z.string().describe("Description of the purpose"),
  category: z.string().describe("Category of the purpose"),
});

export const CreatePurposeInputSchema = createInputSchema(PurposeSchema);
export const UpdatePurposeInputSchema = updateInputSchema(PurposeSchema);
export const PurposeResponseSchema = responseSchema(PurposeSchema);
export const PurposesListResponseSchema = listResponseSchema(PurposeSchema);

export type Purpose = z.infer<typeof PurposeSchema>;
export type CreatePurposeInput = z.infer<typeof CreatePurposeInputSchema>;
export type UpdatePurposeInput = z.infer<typeof UpdatePurposeInputSchema>;
export type PurposeResponse = z.infer<typeof PurposeResponseSchema>;
export type PurposesListResponse = z.infer<typeof PurposesListResponseSchema>;
