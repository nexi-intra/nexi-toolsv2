import { z } from "zod";
import {
  createInputSchema,
  updateInputSchema,
  responseSchema,
  listResponseSchema,
} from ".";
import { SharedAttributes } from "./_shared";

export const ToolGroupSchema = SharedAttributes.extend({
  name: z.string().describe("Name of the tool group"),
  description: z.string().describe("Description of the tool group"),
});

export const CreateToolGroupInputSchema = createInputSchema(ToolGroupSchema);
export const UpdateToolGroupInputSchema = updateInputSchema(ToolGroupSchema);
export const ToolGroupResponseSchema = responseSchema(ToolGroupSchema);
export const ToolGroupsListResponseSchema = listResponseSchema(ToolGroupSchema);

export type ToolGroup = z.infer<typeof ToolGroupSchema>;
export type CreateToolGroupInput = z.infer<typeof CreateToolGroupInputSchema>;
export type UpdateToolGroupInput = z.infer<typeof UpdateToolGroupInputSchema>;
export type ToolGroupResponse = z.infer<typeof ToolGroupResponseSchema>;
export type ToolGroupsListResponse = z.infer<
  typeof ToolGroupsListResponseSchema
>;
