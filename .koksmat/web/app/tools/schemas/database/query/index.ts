import * as tools from "./tools";
import * as countries from "./tools";

import { z } from "zod";

// Define a union of all available query names
const queryNames = ["tools", "countries"] as const;
type QueryName = (typeof queryNames)[number];

// Consolidate queries from multiple modules
const queries = {
  tools: tools.metadata,
  countries: countries.metadata,
};

// Function to retrieve a query by name
export const getView = (queryName: QueryName) => {
  const query = queries[queryName];
  if (!query) {
    throw new Error(`View ${queryName} not found.`);
  }
  return {
    sql: query.sql,
    schema: query.schema,
    parameters: query.parameters,
  };
};

// Type-safe function to infer schema and parameters for a specific query
export const getTypedView = <T extends QueryName>(
  queryName: T
): {
  sql: string;
  schema: z.infer<(typeof queries)[T]["schema"]>;
  parameters: (typeof queries)[T]["parameters"];
} => {
  const query = getView(queryName);
  return {
    sql: query.sql,
    schema: query.schema,
    parameters: query.parameters,
  };
};
