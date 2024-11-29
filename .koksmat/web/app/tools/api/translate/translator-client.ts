import { z } from "zod";
import { APPNAME } from "@/app/global";

// Define the Language type using Zod
const LanguageSchema = z.enum([
  "Afrikaans",
  "Arabic",
  "Bulgarian",
  "Bengali",
  "Bosnian",
  "Catalan",
  "Czech",
  "Welsh",
  "Danish",
  "German",
  "Greek",
  "English",
  "Spanish",
  "Estonian",
  "Persian",
  "Finnish",
  "Filipino",
  "Fijian",
  "French",
  "Irish",
  "Hebrew",
  "Hindi",
  "Croatian",
  "Haitian Creole",
  "Hungarian",
  "Indonesian",
  "Icelandic",
  "Italian",
  "Japanese",
  "Korean",
  "Lithuanian",
  "Latvian",
  "Malagasy",
  "Malay",
  "Maltese",
  "Hmong Daw",
  "Norwegian",
  "Dutch",
  "Querétaro Otomi",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Slovak",
  "Slovenian",
  "Samoan",
  "Serbian (Cyrillic)",
  "Serbian (Latin)",
  "Swedish",
  "Swahili",
  "Tamil",
  "Telugu",
  "Thai",
  "Klingon (Latin)",
  "Tongan",
  "Turkish",
  "Tahitian",
  "Ukrainian",
  "Urdu",
  "Vietnamese",
  "Yucatec Maya",
  "Cantonese (Traditional)",
  "Chinese Simplified",
  "Chinese Traditional",
]);

export type Language = z.infer<typeof LanguageSchema>;

// Define the TranslationResult schema
const TranslationResultSchema = z.object({
  original: z.string(),
  translations: z.record(LanguageSchema, z.string()),
});

type TranslationResult = z.infer<typeof TranslationResultSchema>;

// Define the TranslatorClient schema
const TranslatorClientSchema = z.object({
  baseUrl: z.string(),
  getToken: z.function().returns(z.union([z.string(), z.promise(z.string())])),
});

export class TranslatorClient {
  private baseUrl: string;
  private getToken: () => string | Promise<string>;

  constructor(getToken: () => string | Promise<string>) {
    this.baseUrl = "/" + APPNAME + "/api/translate";
    this.getToken = getToken;

    // Validate the instance using ZeroTrust
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
    const result = await response.json();
    return TranslationResultSchema.parse(result);
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
    const results = await response.json();
    return z.array(TranslationResultSchema).parse(results);
  }
}
