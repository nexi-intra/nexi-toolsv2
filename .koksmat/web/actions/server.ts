"use server";
import { MSAL } from "@/app/global";
import { checkToken } from "@/app/koksmat/src/v.next/lib/token-validation";
import { SQLSafeString } from "@/app/koksmat/src/v.next/schemas/sqlsafestring";
import { Result } from "@/app/koksmat0/httphelper";
import { th, tr } from "date-fns/locale";
import { NatsConnection, connect, StringCodec } from "nats";
import { z } from "zod";

export interface MagicRequest {
  args: any[];
  body: string;
  channel: string;
  timeout: number;
}
const DATABASENAME = "tools";
export async function getRecord<T>(
  tablename: string,
  id: string,
  token: string
) {
  try {
    if (!checkToken(token, MSAL.clientId)) throw new Error("Invalid token");
    const input = z
      .object({
        tablename: SQLSafeString,
        id: SQLSafeString,
        token: z.string(),
      })
      .parse({ tablename, id, token });
    const sql = `select * from ${input.tablename} where id = ${input.id} and deleted_at is null`;
    const result = await runServerActionProduction<T>(
      "magic-mix.app",
      ["query", DATABASENAME, sql],
      "",
      600,
      token
    );
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getRecord", error.message);
    } else {
      console.log("Error in getRecord", error);
    }
    return null;
  }
}

export async function getRecords<T>(tablename: string, token: string) {
  try {
    const input = z
      .object({
        tablename: SQLSafeString,

        token: z.string(),
      })
      .parse({ tablename, token });

    const sql = `select * from ${input.tablename} where  deleted_at is null`;
    const result = await runServerActionProduction<T>(
      "magic-mix.app",
      ["query", DATABASENAME, sql],
      "",
      600,
      token
    );
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getRecord", error.message);
    } else {
      console.log("Error in getRecord", error);
    }
    return null;
  }
}

export async function runServerAction<T>(
  subject: string,
  args: string[],
  body: string,
  timeout: number,
  channel: string
): Promise<Result<T>> {
  const req: MagicRequest = {
    args,
    body,
    channel,
    timeout,
  };

  let errorMessage: string | undefined = undefined;
  let hasError = false;
  let nc: NatsConnection | null = null;
  let data: T | undefined = undefined;
  let serviceCallResult: Result<any>;

  try {
    if (process.env.NODE_ENV === "production")
      throw new Error("Not allowed in production 1");
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    const payload = JSON.stringify(req);

    const sc = StringCodec();
    const encodedPayload = sc.encode(payload);
    const response = await nc
      .request(subject, encodedPayload, { timeout: timeout * 1000 })
      .catch((error) => {
        console.log("connecting to NATS", connectionString);
        console.log("subject", subject);
        console.log("payload", payload);

        console.error("Error", error);
        hasError = true;
        errorMessage = (error as any).message;
      });
    if (response) {
      serviceCallResult = JSON.parse(sc.decode(response.data));

      errorMessage = serviceCallResult.errorMessage ?? "Unknown error";
      hasError = serviceCallResult.hasError;
      if (!hasError) {
        data = JSON.parse(serviceCallResult.data);
      } else {
        data = undefined;
      }
    }
  } catch (error) {
    hasError = true;
    errorMessage = (error as any).message;
  } finally {
    if (nc) {
      nc.close();
    }
  }

  const result: Result<T> = {
    hasError,
    errorMessage,
    data,
  };

  return result;
}

async function runServerActionProduction<T>(
  subject: string,
  args: string[],
  body: string,
  timeout: number,
  channel: string
): Promise<Result<T>> {
  const req: MagicRequest = {
    args,
    body,
    channel,
    timeout,
  };

  let errorMessage: string | undefined = undefined;
  let hasError = false;
  let nc: NatsConnection | null = null;
  let data: T | undefined = undefined;
  let serviceCallResult: Result<any>;

  try {
    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    const payload = JSON.stringify(req);

    const sc = StringCodec();
    const encodedPayload = sc.encode(payload);
    const response = await nc
      .request(subject, encodedPayload, { timeout: timeout * 1000 })
      .catch((error) => {
        console.log("connecting to NATS", connectionString);
        console.log("subject", subject);
        console.log("payload", payload);

        console.error("Error", error);
        hasError = true;
        errorMessage = (error as any).message;
      });
    if (response) {
      serviceCallResult = JSON.parse(sc.decode(response.data));

      errorMessage = serviceCallResult.errorMessage ?? "Unknown error";
      hasError = serviceCallResult.hasError;
      if (!hasError) {
        data = JSON.parse(serviceCallResult.data);
      } else {
        data = undefined;
      }
    }
  } catch (error) {
    hasError = true;
    errorMessage = (error as any).message;
  } finally {
    if (nc) {
      nc.close();
    }
  }

  const result: Result<T> = {
    hasError,
    errorMessage,
    data,
  };

  return result;
}
