import { APPNAME } from "@/app/global";

export type Language =
  | "Afrikaans"
  | "Arabic"
  | "Bulgarian"
  | "Bengali"
  | "Bosnian"
  | "Catalan"
  | "Czech"
  | "Welsh"
  | "Danish"
  | "German"
  | "Greek"
  | "English"
  | "Spanish"
  | "Estonian"
  | "Persian"
  | "Finnish"
  | "Filipino"
  | "Fijian"
  | "French"
  | "Irish"
  | "Hebrew"
  | "Hindi"
  | "Croatian"
  | "Haitian Creole"
  | "Hungarian"
  | "Indonesian"
  | "Icelandic"
  | "Italian"
  | "Japanese"
  | "Korean"
  | "Lithuanian"
  | "Latvian"
  | "Malagasy"
  | "Malay"
  | "Maltese"
  | "Hmong Daw"
  | "Norwegian"
  | "Dutch"
  | "Querétaro Otomi"
  | "Polish"
  | "Portuguese"
  | "Romanian"
  | "Russian"
  | "Slovak"
  | "Slovenian"
  | "Samoan"
  | "Serbian (Cyrillic)"
  | "Serbian (Latin)"
  | "Swedish"
  | "Swahili"
  | "Tamil"
  | "Telugu"
  | "Thai"
  | "Klingon (Latin)"
  | "Tongan"
  | "Turkish"
  | "Tahitian"
  | "Ukrainian"
  | "Urdu"
  | "Vietnamese"
  | "Yucatec Maya"
  | "Cantonese (Traditional)"
  | "Chinese Simplified"
  | "Chinese Traditional";

interface TranslationResult {
  original: string;
  translations: Record<Language, string>;
}

export class TranslatorClient {
  private baseUrl: string;
  private getToken: () => string | Promise<string>;

  constructor(getToken: () => string | Promise<string>) {
    this.baseUrl = "/" + APPNAME + "/api/translate";
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
