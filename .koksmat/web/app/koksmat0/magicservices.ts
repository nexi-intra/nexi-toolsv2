"use server";
import { Result } from "@/app/koksmat0/httphelper";
import { NatsConnection, connect, StringCodec } from "nats";

export interface MagicRequest {
  args: any[];
  body: string;
  channel: string;
  timeout: number;
}

export async function run<T>(
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
