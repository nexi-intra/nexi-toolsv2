// Import necessary modules and types
import { Result } from "@/app/koksmat/httphelper";
import { NatsConnection, connect, StringCodec } from "nats";
import { z } from "zod";
import { schemaMapObjects, SchemaName } from "./schemas";
import { BackendService } from "./BackendService";

// natsRequest function remains the same, adjusted for any types
async function natsRequest(
  subject: string,
  payload: any,
  timeout: number
): Promise<any> {
  let nc: NatsConnection | null = null;
  try {
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });

    const sc = StringCodec();
    const encodedPayload = sc.encode(JSON.stringify(payload));
    const response = await nc.request(subject, encodedPayload, {
      timeout: timeout * 1000,
    });

    const serviceCallResult = JSON.parse(sc.decode(response.data));
    if (serviceCallResult.hasError) {
      return {
        hasError: true,
        errorMessage: serviceCallResult.errorMessage ?? "Unknown error",
        data: undefined,
      };
    }

    if (serviceCallResult.data === undefined) {
      return {
        hasError: true,
        errorMessage: "No data returned from service",
        data: undefined,
      };
    }

    return {
      hasError: false,
      errorMessage: undefined,
      data: serviceCallResult.data,
    };
  } catch (error) {
    return {
      hasError: true,
      errorMessage: (error as Error).message,
      data: undefined,
    };
  } finally {
    if (nc) {
      await nc.close();
    }
  }
}

// Adjusted NatsBackendService class implementing BackendService
export class NatsBackendService implements BackendService {
  private timeout: number;
  private channel: string;

  constructor(timeout: number = 30, channel: string = "default") {
    this.timeout = timeout;
    this.channel = channel;
  }

  async getAll(
    entityType: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    const subject = `${entityType}.getAll`;
    const payload = {
      args: [page, pageSize],
      body: "",
      channel: this.channel,
      timeout: this.timeout,
    };

    const result = await natsRequest(subject, payload, this.timeout);

    if (!result.hasError && result.data) {
      // Optionally validate data with Zod schema
      if (schemaMapObjects[entityType as SchemaName]) {
        result.data.items = result.data.items.map((item: any) =>
          schemaMapObjects[entityType as SchemaName].parse(item)
        );
      }
    }

    return result;
  }

  async getById(entityType: string, id: string): Promise<any> {
    const subject = `${entityType}.getById`;
    const payload = {
      args: [id],
      body: "",
      channel: this.channel,
      timeout: this.timeout,
    };

    const result = await natsRequest(subject, payload, this.timeout);

    if (!result.hasError && result.data) {
      if (schemaMapObjects[entityType as SchemaName]) {
        result.data = schemaMapObjects[entityType as SchemaName].parse(
          result.data
        );
      }
    }

    return result;
  }

  async create(entityType: string, data: any): Promise<any> {
    const subject = `${entityType}.create`;
    const payload = {
      args: [],
      body: JSON.stringify(data),
      channel: this.channel,
      timeout: this.timeout,
    };

    const result = await natsRequest(subject, payload, this.timeout);

    if (!result.hasError && result.data) {
      if (schemaMapObjects[entityType as SchemaName]) {
        result.data = schemaMapObjects[entityType as SchemaName].parse(
          result.data
        );
      }
    }

    return result;
  }

  async update(entityType: string, id: string, data: any): Promise<any> {
    const subject = `${entityType}.update`;
    const payload = {
      args: [id],
      body: JSON.stringify(data),
      channel: this.channel,
      timeout: this.timeout,
    };

    const result = await natsRequest(subject, payload, this.timeout);

    if (!result.hasError && result.data) {
      if (schemaMapObjects[entityType as SchemaName]) {
        result.data = schemaMapObjects[entityType as SchemaName].parse(
          result.data
        );
      }
    }

    return result;
  }

  async delete(entityType: string, id: string): Promise<any> {
    const subject = `${entityType}.delete`;
    const payload = {
      args: [id],
      body: "",
      channel: this.channel,
      timeout: this.timeout,
    };

    return await natsRequest(subject, payload, this.timeout);
  }
}

// Factory function remains the same
export const natsBackendServiceFactory = (
  timeout: number = 30,
  channel: string = "default"
) => new NatsBackendService(timeout, channel);
