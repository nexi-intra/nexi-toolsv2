import { z } from "zod";

// Define SharedAttributes

// Generic function to create a schema for creating an entity
export function createInputSchema<T extends z.ZodObject<any>>(schema: T) {
  return schema.omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    deletedAt: true,
    deletedBy: true,
  });
}

// Generic function to create a schema for updating an entity
export function updateInputSchema<T extends z.ZodObject<any>>(schema: T) {
  return schema.partial().omit({
    id: true,
    createdAt: true,
    createdBy: true,
    updatedAt: true,
    updatedBy: true,
    deletedAt: true,
    deletedBy: true,
  });
}

// Generic function to create a response schema for a single entity
export function responseSchema<T extends z.ZodObject<any>>(schema: T) {
  return z.object({
    data: schema,
    message: z.string(),
    success: z.boolean(),
  });
}

// Generic function to create a response schema for a list of entities
export function listResponseSchema<T extends z.ZodObject<any>>(schema: T) {
  return z.object({
    data: z.object({
      items: z.array(schema),
      totalCount: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }),
    message: z.string(),
    success: z.boolean(),
  });
}

// Tool types
export {
  ToolSchema,
  ToolStatus,
  CreateToolInputSchema,
  UpdateToolInputSchema,
  ToolResponseSchema,
  ToolsListResponseSchema,
} from "./tool";
export type {
  Tool,
  CreateToolInput,
  UpdateToolInput,
  ToolResponse,
  ToolsListResponse,
} from "./tool";

// Country types
export {
  CountrySchema,
  CreateCountryInputSchema,
  UpdateCountryInputSchema,
  CountryResponseSchema,
  CountriesListResponseSchema,
} from "./country";
export type {
  Country,
  CreateCountryInput,
  UpdateCountryInput,
  CountryResponse,
  CountriesListResponse,
} from "./country";

// Purpose types
export {
  PurposeSchema,
  CreatePurposeInputSchema,
  UpdatePurposeInputSchema,
  PurposeResponseSchema,
  PurposesListResponseSchema,
} from "./purpose";
export type {
  Purpose,
  CreatePurposeInput,
  UpdatePurposeInput,
  PurposeResponse,
  PurposesListResponse,
} from "./purpose";

// Tag types
export {
  TagSchema,
  CreateTagInputSchema,
  UpdateTagInputSchema,
  TagResponseSchema,
  TagsListResponseSchema,
} from "./tag";
export type {
  Tag,
  CreateTagInput,
  UpdateTagInput,
  TagResponse,
  TagsListResponse,
} from "./tag";

// ToolGroup types
export {
  ToolGroupSchema,
  CreateToolGroupInputSchema,
  UpdateToolGroupInputSchema,
  ToolGroupResponseSchema,
  ToolGroupsListResponseSchema,
} from "./toolGroup";
export type {
  ToolGroup,
  CreateToolGroupInput,
  UpdateToolGroupInput,
  ToolGroupResponse,
  ToolGroupsListResponse,
} from "./toolGroup";

// User types
export {
  UserSchema,
  UserRoleSchema,
  UserStatusSchema,
  CreateUserInputSchema,
  UpdateUserInputSchema,
  UserResponseSchema,
  UsersListResponseSchema,
} from "./user";
export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  UsersListResponse,
} from "./user";
