import { z } from "zod";
import { ViewNames } from "@/app/tools/schemas/database/view";
import { ParametersType } from "../lib/database-handler";

export type ViewMode = "card" | "table" | "list" | "raw"; //| "calendar" | "kanban";
export type EditMode = "view" | "edit" | "new"; //| "calendar" | "kanban";

export type RenderItemFunction<T> = (
  item: T,
  viewMode: ViewMode
) => React.ReactNode;

export type EditItemFunction<T> = (
  viewMode: EditMode,
  id?: number
) => React.ReactNode;

export type AddItemFunction = (viewMode: EditMode) => React.ReactNode;

export const BaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  searchIndex: z.string(),
});

export type Base = z.infer<typeof BaseSchema>;

type OnLoadedType = (items: Base[]) => void;

export interface LinkListProps {
  searchFor?: string;
  basePath: string;
  prefix: string;
  onLoaded?: OnLoadedType;
}

export type DatabaseItemsViewerProps<S extends z.ZodType<any, any, any>> = {
  viewName: ViewNames;

  parameters?: ParametersType;
  schema: S;
  tableName: string;
  renderItem?: RenderItemFunction<z.infer<S>>;
  addItem?: AddItemFunction;
  editItem?: EditItemFunction<z.infer<S>>;
  searchFor?: string;
  options?: {
    pageSize?: number;
    heightBehaviour?: "Full" | "Dynamic";
    mode?: "view" | "edit";
    hideToolbar?: boolean;
    defaultViewMode?: ViewMode;
    onLoaded?: OnLoadedType;
    version?: number;
    componentNoItems?: React.ReactNode;
  };
};

export type ViewItemOptionsProps = {
  pageSize?: number;
  heightBehaviour?: "Dynamic" | "Full";
  defaultViewMode?: ViewMode;
  hideToolbar?: boolean;
  onLoaded?: OnLoadedType;
  componentNoItems?: React.ReactNode;
};
