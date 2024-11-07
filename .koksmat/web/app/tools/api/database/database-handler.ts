import { z } from "zod";
import { kError, kInfo, kVerbose } from "@/lib/koksmat-logger-client";

interface MessageProvider {
  send(
    callback: () => {
      token: string;
      subject: string;
      targetData: any;
      payload: any;
    }
  ): Promise<any>;
}

export class DatabaseHandler<T extends z.ZodObject<any>> {
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

      // Prepare the callback function
      const callback = () => {
        const token = this._getToken();
        const subject = "create";
        const targetData = null;
        const payload = parsedData;

        return { token, subject, targetData, payload };
      };

      kVerbose("Dispatching create message via message provider");

      const response = await this._messageProvider.send(callback);

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

      // Prepare the callback function
      const callback = () => {
        const token = this._getToken();
        const subject = "update";
        const targetData = { id };
        const payload = parsedData;

        return { token, subject, targetData, payload };
      };

      kVerbose(`Dispatching update message via message provider for id ${id}`);

      const response = await this._messageProvider.send(callback);

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

      // Prepare the callback function
      const callback = () => {
        const token = this._getToken();
        const subject = "patch";
        const targetData = { id };
        const payload = parsedData;

        return { token, subject, targetData, payload };
      };

      kVerbose(`Dispatching patch message via message provider for id ${id}`);

      const response = await this._messageProvider.send(callback);

      kInfo(`Patch operation completed successfully for id ${id}`);
      return response;
    } catch (error) {
      kError(`Error in patch operation for id ${id}`, error);
      throw error;
    }
  }

  async delete(id: number, hardDelete: boolean = false): Promise<any> {
    try {
      kVerbose(
        `Starting delete operation for id ${id} with hardDelete=${hardDelete}`
      );

      // Prepare the callback function
      const callback = () => {
        const token = this._getToken();
        const subject = "delete";
        const targetData = { id };
        const payload = { hardDelete };

        return { token, subject, targetData, payload };
      };

      kVerbose(
        `Dispatching delete message via message provider for id ${id} with hardDelete=${hardDelete}`
      );

      const response = await this._messageProvider.send(callback);

      kInfo(
        `Delete operation completed successfully for id ${id} with hardDelete=${hardDelete}`
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

      // Prepare the callback function
      const callback = () => {
        const token = this._getToken();
        const subject = "restore";
        const targetData = { id };
        const payload = null;

        return { token, subject, targetData, payload };
      };

      kVerbose(`Dispatching restore message via message provider for id ${id}`);

      const response = await this._messageProvider.send(callback);

      kInfo(`Restore operation completed successfully for id ${id}`);
      return response;
    } catch (error) {
      kError(`Error in restore operation for id ${id}`, error);
      throw error;
    }
  }
}
