import { z } from "zod";
import {
  Tool,
  Country,
  Purpose,
  Tag,
  ToolGroup,
  User,
  schemaMapObjects,
  SchemaName,
} from "./schemas";

import { SharedAttributes } from "./schemas/_shared";
// Define a union type for all entity types
type EntityType = Tool | Country | Purpose | Tag | ToolGroup | User;

/**
 * MockBackendService
 *
 * This file contains a mock implementation of the backend service
 * for the Nexi Tools project. It simulates database operations
 * using in-memory storage with pre-populated data.
 */

type EntityInput<T extends z.ZodObject<any>> = z.input<
  typeof SharedAttributes
> &
  z.input<T>;
type EntityOutput<T extends z.ZodObject<any>> = z.output<
  typeof SharedAttributes
> &
  z.output<T>;
let id = 0;
export function createEntity<T extends z.ZodObject<any>>(
  schema: T,
  userId: string,
  data: Partial<EntityInput<T>>
): EntityOutput<T> {
  const now = new Date();
  id++;
  const sharedData = {
    id,
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId,
    deletedAt: null,
    deletedBy: null,
  };

  const mergedData = {
    ...sharedData,
    ...data,
  };

  const validatedData = SharedAttributes.merge(schema).parse(mergedData);
  return validatedData as EntityOutput<T>;
}

// Pre-populated mock database
const db: Record<string, any[]> = {
  tool: [
    // Microsoft 365 Tools
    createEntity(schemaMapObjects.tool, "system", {
      name: "Microsoft Teams",
      description: "Team collaboration and communication platform",
      url: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",
      groupId: "group1",
      purposeIds: ["purpose1", "purpose2"],
      tagIds: ["tag1", "tag2"],
      version: "1.5.00.8070",
      status: "active",
      icon: "https://example.com/teams-icon.png",
      documentationUrl: "https://docs.microsoft.com/en-us/microsoftteams/",
      supportContact: "support@microsoft.com",
      license: "Commercial",
      compatiblePlatforms: ["Windows", "macOS", "iOS", "Android", "Web"],
      systemRequirements: "Windows 10 or later, macOS 10.14 or later",
    }),
    // ... (other tools)
  ],
  country: [
    // European countries
    createEntity(schemaMapObjects.country, "system", {
      name: "Albania",
      code: "AL",
      continent: "Europe",
      currency: "ALL",
      phoneCode: "+355",
    }),

    // ... (other countries)
  ],
  purpose: [
    createEntity(schemaMapObjects.purpose, "system", {
      name: "Collaboration",
      description: "Tools for team collaboration and communication",
      category: "Productivity",
    }),
    // ... (other purposes)
  ],
  tag: [
    createEntity(schemaMapObjects.tag, "system", {
      name: "Microsoft 365",
      color: "#0078D4",
    }),
    // ... (other tags)
  ],
  toolGroup: [
    createEntity(schemaMapObjects.toolGroup, "system", {
      name: "Microsoft 365",
      description: "Tools provided by Microsoft 365 suite",
    }),
    // ... (other tool groups)
  ],
  user: [
    createEntity(schemaMapObjects.user, "system", {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      countryId: "GB",
      status: "active",
    }),
    // ... (other users)
  ],
};

// Mock backend service
const mockBackendService = {
  getAll: async (entityType: string, page: number, pageSize: number) => {
    const entities = db[entityType] || [];
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = entities.slice(startIndex, endIndex);
    const totalCount = entities.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  getById: async (entityType: string, id: string) => {
    const entity = (db[entityType] || []).find((item) => item.id === id);
    if (!entity) {
      throw new Error("Entity not found");
    }
    return entity;
  },

  create: async (entityType: string, data: Partial<EntityType>) => {
    const schema = schemaMapObjects[entityType as SchemaName];
    if (!schema) {
      throw new Error("Invalid entity type");
    }
    const newEntity = createEntity(schema, "system", data);
    db[entityType].push(newEntity);
    return newEntity;
  },

  update: async (entityType: string, id: string, data: Partial<EntityType>) => {
    const index = db[entityType].findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Entity not found");
    }
    const schema = schemaMapObjects[entityType as SchemaName];
    if (!schema) {
      throw new Error("Invalid entity type");
    }
    const updatedEntity = createEntity(schema, "system", {
      ...db[entityType][index],
      ...data,
      updatedAt: new Date(),
    });
    db[entityType][index] = updatedEntity;
    return updatedEntity;
  },

  delete: async (entityType: string, id: string) => {
    const index = db[entityType].findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Entity not found");
    }
    db[entityType].splice(index, 1);
  },
};

// Factory function to create the mock backend service
export const mockBackendServiceFactory = () => mockBackendService;
