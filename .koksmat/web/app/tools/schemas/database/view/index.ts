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
const viewNames = [
  "tools",
  "countries",
  "category",
  "region",
  "language",
  "accesspoint",
  "purpose",
  "toolgroup",
  "usergroup",
  "userprofile",
  "userroles",
] as const;
export type ViewNames = (typeof viewNames)[number];

// Consolidate views from multiple modules
const views = {
  tools: tools.metadata,
  countries: countries.metadata,
  category: category.metadata,
  region: regions.metadata,
  accesspoint: accesspoints.metadata,
  language: languages.metadata,
  purpose: purposes.metadata,
  toolgroup: toolgroups.metadata,
  userroles: userroles.metadata,
  usergroup: usergroups.metadata,
  userprofile: userprofiles.metadata,
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
