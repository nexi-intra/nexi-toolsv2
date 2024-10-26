type Language =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Italian"
  | "Portuguese"
  | "Russian"
  | "Chinese"
  | "Japanese"
  | "Korean";

interface TranslationResult {
  original: string;
  translations: Record<Language, string>;
}

export class TranslatorClient {
  private baseUrl: string;
  private getToken: () => string | Promise<string>;

  constructor(getToken: () => string | Promise<string>) {
    this.baseUrl = "/api/translate";
    this.getToken = getToken;
  }

  private async fetchWithAuth(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await Promise.resolve(this.getToken());
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

  async translateText(
    text: string,
    sourceLanguage: Language,
    targetLanguages: Language[]
  ): Promise<TranslationResult> {
    const response = await this.fetchWithAuth(this.baseUrl, {
      method: "POST",
      body: JSON.stringify({ text, sourceLanguage, targetLanguages }),
    });
    return response.json();
  }

  async translateBatch(
    texts: string[],
    sourceLanguage: Language,
    targetLanguages: Language[]
  ): Promise<TranslationResult[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/batch`, {
      method: "POST",
      body: JSON.stringify({ texts, sourceLanguage, targetLanguages }),
    });
    return response.json();
  }
}
