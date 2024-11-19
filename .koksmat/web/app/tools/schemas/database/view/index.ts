import { database } from "@/actions/database/works/activityModel";
import * as tools from "./tools";
import * as countries from "./countries";
import * as category from "./categories";
import * as purposes from "./purposes";
import * as languages from "./languages";
import * as accesspoints from "./accesspoints";
import * as regions from "./regions";
import * as userroles from "./userroles";
import * as usergroups from "./usergroups";
import * as userprofiles from "./userprofiles";
import * as toolgroups from "./toolgroups";

import { z } from "zod";
import { access } from "fs";
import { User } from "lucide-react";

// Define a union of all available query names
export const viewNames = [
  "tools",
  "countries",
  "categories",
  "regions",
  "languages",
  "accesspoints",
  "purposes",
  "toolgroups",
  "usergroups",
  "userprofiles",
  "userroles",
] as const;
export type ViewNames = (typeof viewNames)[number];

// Consolidate views from multiple modules
const views = {
  tools: tools.metadata,
  countries: countries.metadata,
  categories: category.metadata,
  regions: regions.metadata,
  accesspoints: accesspoints.metadata,
  languages: languages.metadata,
  purposes: purposes.metadata,
  toolgroups: toolgroups.metadata,
  userroles: userroles.metadata,
  usergroups: usergroups.metadata,
  userprofiles: userprofiles.metadata,
};

// Function to retrieve a view by name
export const getView = (queryName: ViewNames) => {
  const query = views[queryName];
  if (!query) {
    return null; // throw new Error(`View ${queryName} not found.`);
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
  if (!query) {
    throw new Error(`View ${queryName} not found.`);
  }
  return {
    sql: query.sql,
    schema: query.schema,
    parameters: query.parameters,
  };
};
