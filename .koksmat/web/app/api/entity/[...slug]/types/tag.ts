import { z } from "zod";
import {
  createInputSchema,
  updateInputSchema,
  responseSchema,
  listResponseSchema,
} from ".";
import { SharedAttributes } from "./_shared";

export const TagSchema = SharedAttributes.extend({
  name: z.string().describe("Name of the tag"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .describe("Color of the tag in hexadecimal format"),
});

export const CreateTagInputSchema = createInputSchema(TagSchema);
export const UpdateTagInputSchema = updateInputSchema(TagSchema);
export const TagResponseSchema = responseSchema(TagSchema);
export const TagsListResponseSchema = listResponseSchema(TagSchema);

export type Tag = z.infer<typeof TagSchema>;
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagInputSchema>;
export type TagResponse = z.infer<typeof TagResponseSchema>;
export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;
