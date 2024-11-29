import { infer, z } from "zod";
import { kError, kInfo, kVerbose } from "@/lib/koksmat-logger-client";
import { DatabaseMessageType } from "../endpoints/database-messages-server";
import { ActionNames, actionNames } from "@/app/tools/schemas/database/actions";
import { ViewNames, viewNames } from "@/app/tools/schemas/database/view";

// export interface DatabaseMessageType {
//   subject: string;
//   targetDatabase: any;
//   record: any;
// }d

export interface MessageProvider {
  send(message: DatabaseMessageType, token: string): Promise<any>;
}

export interface TokenProvider {
  getToken(): Promise<string>;
}
export const parametersType = z.array(z.string()).optional();
export type ParametersType = z.infer<typeof parametersType>;
export type DatabaseHandlerType<T extends z.ZodObject<any>> = {
  create(data: z.infer<T>): Promise<number>;
  read(id: number): Promise<z.infer<T>>;
  update(id: number, data: z.infer<T>): Promise<z.infer<T>>;
  patch(id: number, data: Partial<z.infer<T>>): void;
  delete(id: number, softDelete?: boolean): void;
  restore(id: number): Promise<z.infer<T>>;
  query(queryname: ViewNames, parameters?: ParametersType): Promise<any[]>;
  execute(actionname: ActionNames, data: any): Promise<any>;
};

const createResponseSchema = z.object({
  id: z.number(),
  comments: z.string().optional(),
});
