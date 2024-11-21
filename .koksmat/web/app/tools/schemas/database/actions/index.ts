import { database } from "@/actions/database/works/activityModel";
import { createOrUpdateTool } from "./create-or-update-tool";
import { userprofileFavourite } from "./userprofile-favourite";

import { z } from "zod";

// Define actions object with 'as const' for type safety
const actions = {
  createOrUpdateTool,
  userprofileFavourite,
} as const;

// Derive ActionNames from the keys of actions
export type ActionNames = keyof typeof actions;
export const actionNames = Object.keys(actions) as ActionNames[];

// Function to retrieve an action by name with type safety
export const getAction = <T extends ActionNames>(
  actionName: T
): (typeof actions)[T] | null => {
  const action = actions[actionName];
  if (!action) {
    return null;
    // Or throw an error if you prefer
    // throw new Error(`Action ${actionName} not found.`);
  }
  return action;
};
