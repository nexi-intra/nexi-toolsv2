import { z } from "zod";

export type ViewMode = "card" | "table" | "list"; //| "calendar" | "kanban";
export type RenderItemFunction<T> = (
  item: T,
  viewMode: ViewMode
) => React.ReactNode;

export const BaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  searchIndex: z.string(),
});

export type Base = z.infer<typeof BaseSchema>;
