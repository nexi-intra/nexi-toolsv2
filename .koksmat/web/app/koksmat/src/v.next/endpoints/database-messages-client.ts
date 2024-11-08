import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { kError, kVerbose } from "@/lib/koksmat-logger-client";
import { MessageProvider } from "../lib/database-handler";

async function fetchWithAuth(
  url: string,
  getToken: () => Promise<string>,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getToken();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Translation error! status: ${response.status}`);
  }
  return response;
}

export class MessageToKoksmatDatabase implements MessageProvider {
  private baseUrl: string;
  private getToken: () => Promise<string>;

  constructor(getToken: () => Promise<string>) {
    this.baseUrl = "/koksmat/api/translate";
    this.getToken = getToken;
  }

  async send(message: any): Promise<any> {
    const response = await fetchWithAuth(this.baseUrl, this.getToken, {
      method: "POST",
      body: JSON.stringify(message),
    });
    const result = await response.json();
    return result;
  }
}
