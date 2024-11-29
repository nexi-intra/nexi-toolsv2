import { kError, kVerbose } from "@/lib/koksmat-logger-client";
import { MessageProvider } from "../lib/database-handler";

async function fetchWithAuth(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    kError("endpoint", "Error in fetchWithAuth", response);
    throw new Error(`Error: ${response.status}`);
  }
  return response;
}

export class MessageToKoksmatDatabase implements MessageProvider {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/koksmat/api/database";
  }

  async send(message: any, token: string): Promise<any> {
    kVerbose("client", "Sending message to database", message);
    const response = await fetchWithAuth(this.baseUrl, token, {
      method: "POST",
      body: JSON.stringify(message),
    });
    const result = await response.json();
    kVerbose("client", "Received response from database", result);

    if (result.status !== 200) {
      kError(
        "client",
        "Error communicating with the database",
        result,
        __dirname,
        __filename
      );
      throw new Error("Databases, " + (result.error ?? "Unknown error"));
    }

    return result.data.Result;
  }
}
