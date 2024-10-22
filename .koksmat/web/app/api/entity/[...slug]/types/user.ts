import { z } from "zod";
import {
  createInputSchema,
  updateInputSchema,
  responseSchema,
  listResponseSchema,
} from ".";
import { SharedAttributes } from "./_shared";

export const UserRoleSchema = z.enum(["admin", "user", "guest"]);
export const UserStatusSchema = z.enum(["active", "inactive", "suspended"]);

export const UserSchema = SharedAttributes.extend({
  name: z.string().describe("Name of the user"),
  email: z.string().email().describe("Email address of the user"),
  role: UserRoleSchema.describe("Role of the user"),
  countryId: z
    .string()

    .describe("ID of the country the user is associated with"),

  status: UserStatusSchema.describe("Current status of the user"),
});

export const CreateUserInputSchema = createInputSchema(UserSchema);
export const UpdateUserInputSchema = updateInputSchema(UserSchema);
export const UserResponseSchema = responseSchema(UserSchema);
export const UsersListResponseSchema = listResponseSchema(UserSchema);

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
