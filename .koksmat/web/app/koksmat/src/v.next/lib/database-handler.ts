import { z } from "zod";
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
export type DatabaseHandlerType<T extends z.ZodObject<any>> = {
  create(data: z.infer<T>): Promise<number>;
  read(id: number): Promise<z.infer<T>>;
  update(id: number, data: z.infer<T>): Promise<z.infer<T>>;
  patch(id: number, data: Partial<z.infer<T>>): void;
  delete(id: number, softDelete?: boolean): void;
  restore(id: number): Promise<z.infer<T>>;
  query(queryname: ViewNames): Promise<any[]>;
  execute(actionname: ActionNames, data: any): Promise<any>;
};

const createResponseSchema = z.object({
  id: z.number(),
  comments: z.string().optional(),
});

// export class DatabaseHandler<T extends z.ZodObject<any>>
//   implements DatabaseHandlerType<T>
// {
//   private _schema: T;
//   private _messageProvider: MessageProvider;

//   private _getToken: () => string;

//   constructor(
//     schema: T,
//     messageProvider: MessageProvider,
//     getToken: () => string
//   ) {
//     this._schema = schema;
//     this._messageProvider = messageProvider;
//     this._getToken = getToken;
//   }
//   read(id: number): Promise<z.TypeOf<T>> {
//     throw new Error("Method not implemented.");
//   }

//   async create(data: z.infer<T>): Promise<number> {
//     try {
//       kVerbose("library", "Starting create operation");

//       // Validate data using safeParse
//       const result = this._schema.safeParse(data);
//       if (!result.success) {
//         kVerbose("library", "Validation failed", data);
//         kError("library", "Validation error in create operation", result.error);
//         throw result.error;
//       }
//       const parsedData = result.data;
//       kVerbose("library", "Data validated successfully for create operation");

//       // Build the message object
//       const message: DatabaseMessageType = {
//         subject: "create",
//         targetDatabase: null,
//         record: parsedData,
//       };

//       const token = this._getToken();
//       const response = await this._messageProvider.send(message, token);
//       debugger;
//       const parsedResponse = createResponseSchema.safeParse(response);
//       if (!parsedResponse.success) {
//         kError("library", "Error parsing response", parsedResponse.error);
//         throw new Error("Error parsing response");
//       }

//       kInfo(
//         "library",
//         "Create operation completed successfully, id:",
//         parsedResponse.data.id
//       );
//       return parsedResponse.data.id;
//     } catch (error) {
//       kError("library", "Error in create operation", error);
//       throw error;
//     }
//   }

//   async update(id: number, data: z.infer<T>): Promise<z.infer<T>> {
//     try {
//       kVerbose("library", `Starting update operation for id ${id}`);

//       // Validate data using safeParse
//       const result = this._schema.safeParse(data);
//       if (!result.success) {
//         kVerbose("library", "Validation failed", data);
//         kError(
//           "library",
//           `Validation error in update operation for id ${id}`,
//           result.error
//         );
//         throw result.error;
//       }
//       const parsedData = result.data;
//       kVerbose(
//         "library",
//         `Data validated successfully for update operation on id ${id}`
//       );

//       // Build the message object
//       const message: DatabaseMessageType = {
//         subject: "update",
//         targetDatabase: { id },
//         record: parsedData,
//       };

//       kVerbose(
//         "library",
//         `Dispatching update message via message provider for id ${id}`
//       );
//       const token = this._getToken();
//       const response = await this._messageProvider.send(message, token);

//       kInfo("library", `Update operation completed successfully for id ${id}`);
//       return response;
//     } catch (error) {
//       kError("library", `Error in update operation for id ${id}`, error);
//       throw error;
//     }
//   }

//   async patch(id: number, data: Partial<z.infer<T>>): Promise<z.infer<T>> {
//     try {
//       kVerbose("library", `Starting patch operation for id ${id}`);

//       // Validate data using partial schema and safeParse
//       const partialSchema = this._schema.partial();
//       const result = partialSchema.safeParse(data);
//       if (!result.success) {
//         kVerbose("library", "Validation failed", data);
//         kError(
//           "library",
//           `Validation error in patch operation for id ${id}`,
//           result.error
//         );
//         throw result.error;
//       }
//       const parsedData = result.data;
//       kVerbose(
//         "library",
//         `Data validated successfully for patch operation on id ${id}`
//       );

//       // Build the message object
//       const message: DatabaseMessageType = {
//         subject: "patch",
//         targetDatabase: { id },
//         record: parsedData,
//       };

//       kVerbose(
//         "library",
//         `Dispatching patch message via message provider for id ${id}`
//       );
//       const token = this._getToken();
//       const response = await this._messageProvider.send(message, token);

//       kInfo("library", `Patch operation completed successfully for id ${id}`);
//       return response;
//     } catch (error) {
//       kError("library", `Error in patch operation for id ${id}`, error);
//       throw error;
//     }
//   }

//   async delete(id: number, softDelete: boolean = false) {
//     try {
//       kVerbose(
//         "library",
//         `Starting delete operation for id ${id} with softDelete=${softDelete}`
//       );

//       // Build the message object
//       const message: DatabaseMessageType = {
//         subject: "delete",
//         targetDatabase: { id },
//         record: { softDelete },
//       };

//       kVerbose(
//         "library",
//         `Dispatching delete message via message provider for id ${id} with softDelete=${softDelete}`
//       );
//       const token = this._getToken();
//       const response = await this._messageProvider.send(message, token);

//       kInfo(
//         "library",
//         `Delete operation completed successfully for id ${id} with softDelete=${softDelete}`
//       );
//       return response;
//     } catch (error) {
//       kError("library", `Error in delete operation for id ${id}`, error);
//       throw error;
//     }
//   }

//   async restore(id: number): Promise<z.infer<T>> {
//     try {
//       kVerbose("library", `Starting restore operation for id ${id}`);

//       // Build the message object
//       const message: DatabaseMessageType = {
//         subject: "restore",
//         targetDatabase: { id },
//         record: null,
//       };

//       kVerbose(
//         "library",
//         `Dispatching restore message via message provider for id ${id}`
//       );
//       const token = this._getToken();
//       const response = await this._messageProvider.send(message, token);

//       kInfo("library", `Restore operation completed successfully for id ${id}`);
//       return response;
//     } catch (error) {
//       kError("library", `Error in restore operation for id ${id}`, error);
//       throw error;
//     }
//   }
// }
