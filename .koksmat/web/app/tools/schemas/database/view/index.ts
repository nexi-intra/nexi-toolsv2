import { database } from "@/actions/database/works/activityModel";
import * as tools from "./tools";
import * as countries from "./countries";
import * as category from "./categories";
import * as region from "./regions";

import { z } from "zod";

// Define a union of all available query names
const viewNames = ["tools", "countries", "category", "region"] as const;
export type ViewNames = (typeof viewNames)[number];

// Consolidate views from multiple modules
const views = {
  tools: tools.metadata,
  countries: countries.metadata,
  category: category.metadata,
  region: region.metadata,
};

// Function to retrieve a query by name
export const getView = (queryName: ViewNames) => {
  const query = views[queryName];
  if (!query) {
    throw new Error(`View ${queryName} not found.`);
  }
  return {
    databaseName: query.databaseName,
    sql: query.sql,
    schema: query.schema,
    parameters: query.parameters,
  };
};

// Type-safe function to infer schema and parameters for a specific query
export const getTypedView = <T extends ViewNames>(
  queryName: T
): {
  sql: string;
  schema: z.infer<(typeof views)[T]["schema"]>;
  parameters: (typeof views)[T]["parameters"];
} => {
  const query = getView(queryName);
  return {
    sql: query.sql,
    schema: query.schema,
    parameters: query.parameters,
  };
};
