import { z } from "zod";

import { SharedAttributes } from "./_shared";

export const ToolStatus = z.enum(["active", "inactive", "deprecated"]);

export const ToolSchema = SharedAttributes.extend({
  name: z.string().describe("Name of the tool"),
  description: z
    .string()
    .describe("Description of the tool's purpose and functionality"),
  url: z
    .string()
    .url()
    .describe("URL where the tool can be accessed or downloaded"),
  groupId: z.string().describe("ID of the group this tool belongs to"),
  purposes: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .describe("List of purposes, each with a id, value, and order"),
  tags: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
        color: z.string(),
      })
    )
    .describe("List of tags, each with a id, value, and order"),
  version: z.string().describe("Current version of the tool"),
  status: ToolStatus.describe("Current status of the tool"),
  icon: z
    .string()
    .url()
    .optional()
    .describe("Optional icon or logo for the tool"),
  documentationUrl: z
    .string()
    .url()
    .optional()
    .describe("Optional documentation URL for the tool"),
  supportContact: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe("Optional support contact for the tool"),
  license: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe("Optional license information for the tool"),
  compatiblePlatforms: z
    .array(z.string())
    .optional()
    .describe("Optional array of compatible platforms"),
  systemRequirements: z
    .string()
    .optional()
    .describe("Optional minimum system requirements"),
  relatedToolIds: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe("Optional array of related tools"),
  // New fields to support the information in the image
  countries: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe("Countries involved in the tool's development or usage"),
  repositoryUrl: z
    .string()
    .url()
    .optional()
    .describe("URL of the tool's code repository"),
  collaborationType: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe("Type of collaboration (e.g., 'Open Source', 'Internal')"),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
      })
    )
    .optional()
    .describe("Array of important documents related to the tool"),
  teamSize: z
    .number()
    .optional()
    .describe("Number of team members working on the tool"),
  primaryFocus: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        order: z.string(),
      })
    )
    .optional()
    .describe(
      "Primary focus or category of the tool (e.g., 'Business Productivity')"
    ),
});
