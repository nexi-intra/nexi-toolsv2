import { z } from "zod";

// Import metadata from various modules
import * as tools from "./tools";
import * as countries from "./countries";
import * as categories from "./categories";
import * as purposes from "./purposes";
import * as languages from "./languages";
import * as accesspoints from "./accesspoints";
import * as regions from "./regions";
import * as userroles from "./userroles";
import * as usergroups from "./usergroups";
import * as userprofiles from "./userprofiles";
import * as toolgroups from "./toolgroups";
import * as my_tools from "./my_tools";

// Consolidate views from multiple modules
const views = {
  tools: tools.metadata,
  countries: countries.metadata,
  categories: categories.metadata,
  regions: regions.metadata,
  accesspoints: accesspoints.metadata,
  languages: languages.metadata,
  purposes: purposes.metadata,
  toolgroups: toolgroups.metadata,
  userroles: userroles.metadata,
  usergroups: usergroups.metadata,
  userprofiles: userprofiles.metadata,
  my_tools: my_tools.metadata,
} as const;

// Define a union of all available view names
export type ViewNames = keyof typeof views;
export const viewNames = Object.keys(views) as ViewNames[];

// Type definition for view metadata
type ViewMetadata<T extends ViewNames> = (typeof views)[T];

// Function to retrieve a view by name with type safety
export const getView = <T extends ViewNames>(viewName: T): ViewMetadata<T> => {
  const view = views[viewName];
  if (!view) {
    throw new Error(`View ${viewName} not found.`);
  }
  return view;
};
