"use client";
import React, { useEffect, useState } from "react";

import { z } from "zod";
import { generateMethods } from "@/actions/client";
import { useItem, useItems } from "@/actions/hooks";
import { DatabaseMethods } from "@/actions/model";
const _schema = z
  .object({
    tenant: z.string().optional(),
    searchindex: z
      .string()
      .describe(
        "Search Index is used for concatenating all searchable fields in a single field making in easier to search\n"
      )
      .optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    activity: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .describe("Create operation");
export const database = "works";
export const table = "activitymodel";

type CreateActivitymodelProps = z.infer<typeof _schema>;

export type ActivityModel = Omit<
  CreateActivitymodelProps,
  "tenant" | "searchindex"
>;

export function useActivityModel() {
  const methods = generateMethods(database, table, _schema);
  return {
    ...methods,
  };
}

export function useActivityModelItem(recordId: string) {
  return useItem<ActivityModel>(database, table, recordId);
}

export function useActivityModelItems() {
  return useItems<ActivityModel>(database, table);
}
