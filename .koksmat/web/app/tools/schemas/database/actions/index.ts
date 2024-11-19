import { database } from "@/actions/database/works/activityModel";
import { createOrUpdateTool } from "./create-or-update-tool";

import { z } from "zod";

// Define a union of all available query names
export const actionNames = ["tools"] as const;
export type ActionNames = (typeof actionNames)[number];

const actions = {
  tools: createOrUpdateTool,
};

// Function to retrieve a query by name
export const getAction = (actionName: ActionNames) => {
  const action = actions[actionName];
  if (!action) {
    return null;
    //throw new Error(`Action ${actionName} not found.`);
  }
  return { ...action };
};

// // Type-safe function to infer schema and parameters for a specific query
// export const getTypedView = <T extends ActionNames>(
//   queryName: T
// ): {
//   sql: string;
//   schema: z.infer<(typeof views)[T]["schema"]>;
//   parameters: (typeof views)[T]["parameters"];
// } => {
//   const query = getAction(queryName);
//   return {
//     sql: query.sql,
//     schema: query.schema,
//     parameters: query.parameters,
//   };
// };
