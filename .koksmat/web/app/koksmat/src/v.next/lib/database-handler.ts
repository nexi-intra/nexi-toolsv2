import { z } from "zod";
import { kError, kInfo, kVerbose } from "@/lib/koksmat-logger-client";

export interface DatabaseMessageType {
  token: string;
  subject: string;
  targetData: any;
  payload: any;
}

export interface MessageProvider {
  send(message: DatabaseMessageType): Promise<any>;
}

export type DatabaseHandlerType<T extends z.ZodObject<any>> = {
  create(data: z.infer<T>): Promise<any>;
  update(id: number, data: z.infer<T>): Promise<any>;
  patch(id: number, data: Partial<z.infer<T>>): Promise<any>;
  delete(id: number, softDelete?: boolean): Promise<any>;
  restore(id: number): Promise<any>;
};

export class DatabaseHandler<T extends z.ZodObject<any>>
  implements DatabaseHandlerType<T>
{
  private _schema: T;
  private _messageProvider: MessageProvider;
  private _getToken: () => string;

  constructor(
    schema: T,
    messageProvider: MessageProvider,
    getToken: () => string
  ) {
    this._schema = schema;
    this._messageProvider = messageProvider;
    this._getToken = getToken;
  }

  async create(data: z.infer<T>): Promise<any> {
    try {
      kVerbose("Starting create operation");

      // Validate data using safeParse
      const result = this._schema.safeParse(data);
      if (!result.success) {
        kVerbose("Validation failed", data);
        kError("Validation error in create operation", result.error);
        throw result.error;
      }
      const parsedData = result.data;
      kVerbose("Data validated successfully for create operation");

      // Build the message object
      const message: DatabaseMessageType = {
        token: this._getToken(),
        subject: "create",
        targetData: null,
        payload: parsedData,
      };

      kVerbose("Dispatching create message via message provider");

      const response = await this._messageProvider.send(message);

      kInfo("Create operation completed successfully");
      return response;
    } catch (error) {
      kError("Error in create operation", error);
      throw error;
    }
  }

  async update(id: number, data: z.infer<T>): Promise<any> {
    try {
      kVerbose(`Starting update operation for id ${id}`);

      // Validate data using safeParse
      const result = this._schema.safeParse(data);
      if (!result.success) {
        kVerbose("Validation failed", data);
        kError(
          `Validation error in update operation for id ${id}`,
          result.error
        );
        throw result.error;
      }
      const parsedData = result.data;
      kVerbose(`Data validated successfully for update operation on id ${id}`);

      // Build the message object
      const message: DatabaseMessageType = {
        token: this._getToken(),
        subject: "update",
        targetData: { id },
        payload: parsedData,
      };

      kVerbose(`Dispatching update message via message provider for id ${id}`);

      const response = await this._messageProvider.send(message);

      kInfo(`Update operation completed successfully for id ${id}`);
      return response;
    } catch (error) {
      kError(`Error in update operation for id ${id}`, error);
      throw error;
    }
  }

  async patch(id: number, data: Partial<z.infer<T>>): Promise<any> {
    try {
      kVerbose(`Starting patch operation for id ${id}`);

      // Validate data using partial schema and safeParse
      const partialSchema = this._schema.partial();
      const result = partialSchema.safeParse(data);
      if (!result.success) {
        kVerbose("Validation failed", data);
        kError(
          `Validation error in patch operation for id ${id}`,
          result.error
        );
        throw result.error;
      }
      const parsedData = result.data;
      kVerbose(`Data validated successfully for patch operation on id ${id}`);

      // Build the message object
      const message: DatabaseMessageType = {
        token: this._getToken(),
        subject: "patch",
        targetData: { id },
        payload: parsedData,
      };

      kVerbose(`Dispatching patch message via message provider for id ${id}`);

      const response = await this._messageProvider.send(message);

      kInfo(`Patch operation completed successfully for id ${id}`);
      return response;
    } catch (error) {
      kError(`Error in patch operation for id ${id}`, error);
      throw error;
    }
  }

  async delete(id: number, softDelete: boolean = false): Promise<any> {
    try {
      kVerbose(
        `Starting delete operation for id ${id} with softDelete=${softDelete}`
      );

      // Build the message object
      const message: DatabaseMessageType = {
        token: this._getToken(),
        subject: "delete",
        targetData: { id },
        payload: { softDelete },
      };

      kVerbose(
        `Dispatching delete message via message provider for id ${id} with softDelete=${softDelete}`
      );

      const response = await this._messageProvider.send(message);

      kInfo(
        `Delete operation completed successfully for id ${id} with softDelete=${softDelete}`
      );
      return response;
    } catch (error) {
      kError(`Error in delete operation for id ${id}`, error);
      throw error;
    }
  }

  async restore(id: number): Promise<any> {
    try {
      kVerbose(`Starting restore operation for id ${id}`);

      // Build the message object
      const message: DatabaseMessageType = {
        token: this._getToken(),
        subject: "restore",
        targetData: { id },
        payload: null,
      };

      kVerbose(`Dispatching restore message via message provider for id ${id}`);

      const response = await this._messageProvider.send(message);

      kInfo(`Restore operation completed successfully for id ${id}`);
      return response;
    } catch (error) {
      kError(`Error in restore operation for id ${id}`, error);
      throw error;
    }
  }
}
