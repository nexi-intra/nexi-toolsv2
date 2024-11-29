import { LRUCache } from "lru-cache";
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { APPNAME } from "@/app/global";

// Azure Translator endpoint constant
const AZURE_TRANSLATOR_ENDPOINT =
  "https://api.cognitive.microsofttranslator.com";

// Function to retrieve Azure Translator configuration dynamically
function getAzureTranslatorConfig() {
  const region = process.env.AZURE_TRANSLATOR_REGION;
  const key = process.env.AZURE_TRANSLATOR_KEY;

  // Check for missing environment variables
  if (!region || !key) {
    throw new Error(
      "Missing Azure Translator configuration. Please set the following environment variables:\n" +
        "AZURE_TRANSLATOR_REGION: The region of your Azure Translator resource (e.g., 'eastus')\n" +
        "AZURE_TRANSLATOR_KEY: Your Azure Translator subscription key\n\n" +
        "You can set these variables in your .env.local file or in your deployment environment.\n" +
        "For more information, visit: https://docs.microsoft.com/en-us/azure/cognitive-services/translator/quickstart-translator?tabs=nodejs"
    );
  }

  return { region, key };
}

// Custom error types for more specific error handling
export class TranslationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationError";
  }
}

export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "APIError";
  }
}

// Internal language code type
export type LanguageCode =
  | "af"
  | "ar"
  | "bg"
  | "bn"
  | "bs"
  | "ca"
  | "cs"
  | "cy"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "fa"
  | "fi"
  | "fil"
  | "fj"
  | "fr"
  | "ga"
  | "he"
  | "hi"
  | "hr"
  | "ht"
  | "hu"
  | "id"
  | "is"
  | "it"
  | "ja"
  | "ko"
  | "lt"
  | "lv"
  | "mg"
  | "ms"
  | "mt"
  | "mww"
  | "nb"
  | "nl"
  | "otq"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sk"
  | "sl"
  | "sm"
  | "sr-Cyrl"
  | "sr-Latn"
  | "sv"
  | "sw"
  | "ta"
  | "te"
  | "th"
  | "tlh-Latn"
  | "to"
  | "tr"
  | "ty"
  | "uk"
  | "ur"
  | "vi"
  | "yua"
  | "yue"
  | "zh-Hans"
  | "zh-Hant";

// Public language type with English names
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

// Mapping between Language and LanguageCode
export const languageToCodeMap: Record<Language, LanguageCode> = {
  Afrikaans: "af",
  Arabic: "ar",
  Bulgarian: "bg",
  Bengali: "bn",
  Bosnian: "bs",
  Catalan: "ca",
  Czech: "cs",
  Welsh: "cy",
  Danish: "da",
  German: "de",
  Greek: "el",
  English: "en",
  Spanish: "es",
  Estonian: "et",
  Persian: "fa",
  Finnish: "fi",
  Filipino: "fil",
  Fijian: "fj",
  French: "fr",
  Irish: "ga",
  Hebrew: "he",
  Hindi: "hi",
  Croatian: "hr",
  "Haitian Creole": "ht",
  Hungarian: "hu",
  Indonesian: "id",
  Icelandic: "is",
  Italian: "it",
  Japanese: "ja",
  Korean: "ko",
  Lithuanian: "lt",
  Latvian: "lv",
  Malagasy: "mg",
  Malay: "ms",
  Maltese: "mt",
  "Hmong Daw": "mww",
  Norwegian: "nb",
  Dutch: "nl",
  "Querétaro Otomi": "otq",
  Polish: "pl",
  Portuguese: "pt",
  Romanian: "ro",
  Russian: "ru",
  Slovak: "sk",
  Slovenian: "sl",
  Samoan: "sm",
  "Serbian (Cyrillic)": "sr-Cyrl",
  "Serbian (Latin)": "sr-Latn",
  Swedish: "sv",
  Swahili: "sw",
  Tamil: "ta",
  Telugu: "te",
  Thai: "th",
  "Klingon (Latin)": "tlh-Latn",
  Tongan: "to",
  Turkish: "tr",
  Tahitian: "ty",
  Ukrainian: "uk",
  Urdu: "ur",
  Vietnamese: "vi",
  "Yucatec Maya": "yua",
  "Cantonese (Traditional)": "yue",
  "Chinese Simplified": "zh-Hans",
  "Chinese Traditional": "zh-Hant",
};

// Reverse mapping for convenience
export const codeToLanguageMap: Record<LanguageCode, Language> =
  Object.fromEntries(
    Object.entries(languageToCodeMap).map(([lang, code]) => [
      code,
      lang as Language,
    ])
  ) as Record<LanguageCode, Language>;

export interface Translation {
  text: string;
  to: LanguageCode;
}

export interface TranslationResponse {
  translations: Translation[];
}

export interface TranslationResult {
  original: string;
  translations: Partial<Record<Language, string>>;
}

export interface BatchTranslationResult {
  original: string[];
  translations: Partial<Record<Language, string[]>>;
}

// Simple cache for storing translations
const translationCache = new LRUCache<string, TranslationResult>({
  max: 100, // Maximum number of items to store in the cache
  ttl: 1000 * 60 * 60, // Time to live: 1 hour
});

/**
 * Generates a cache key for a translation request
 * @param text - The text to be translated
 * @param sourceLanguage - The source language
 * @param targetLanguages - The target languages
 * @returns A unique cache key
 */
function getCacheKey(
  text: string,
  sourceLanguage: Language,
  targetLanguages: Language[]
): string {
  return `${text}|${sourceLanguage}|${targetLanguages.sort().join(",")}`;
}

/**
 * Translates a single line of text into multiple target languages using Azure AI Text Translator.
 * @param {string} text - The text to be translated.
 * @param {Language} sourceLanguage - The source language of the text.
 * @param {Language[]} targetLanguages - An array of target languages (e.g., ['Spanish', 'French', 'German']).
 * @returns {Promise<TranslationResult>} - A promise that resolves to an object with translations.
 * @throws {TranslationError} If there's an error during the translation process.
 * @throws {APIError} If there's an error with the API request.
 */
export async function translateOneline(
  text: string,
  sourceLanguage: Language,
  targetLanguages: Language[]
): Promise<TranslationResult> {
  const { region, key } = getAzureTranslatorConfig();
  const cacheKey = getCacheKey(text, sourceLanguage, targetLanguages);
  const cachedResult = translationCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const url = new URL("/translate", AZURE_TRANSLATOR_ENDPOINT);
  url.searchParams.append("api-version", "3.0");
  targetLanguages.forEach((lang) =>
    url.searchParams.append("to", languageToCodeMap[lang])
  );
  url.searchParams.append("from", languageToCodeMap[sourceLanguage]);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ text }]),
    });

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data: TranslationResponse[] = await response.json();
    const translations: Partial<Record<Language, string>> = {};

    data[0].translations.forEach((translation) => {
      const language = codeToLanguageMap[translation.to];
      translations[language] = translation.text;
    });

    const result: TranslationResult = {
      original: text,
      translations: translations,
    };

    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(
      "Translation error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new TranslationError("Failed to translate text");
  }
}

/**
 * Translates multiple lines of text into multiple target languages using Azure AI Text Translator.
 * @param {string[]} texts - An array of texts to be translated.
 * @param {Language} sourceLanguage - The source language of the texts.
 * @param {Language[]} targetLanguages - An array of target languages (e.g., ['Spanish', 'French', 'German']).
 * @returns {Promise<BatchTranslationResult>} - A promise that resolves to an object with translations for each input text.
 * @throws {TranslationError} If there's an error during the translation process.
 * @throws {APIError} If there's an error with the API request.
 */
export async function translateBatch(
  texts: string[],
  sourceLanguage: Language,
  targetLanguages: Language[]
): Promise<BatchTranslationResult> {
  const { region, key } = getAzureTranslatorConfig();
  const url = new URL("/translate", AZURE_TRANSLATOR_ENDPOINT);
  url.searchParams.append("api-version", "3.0");
  targetLanguages.forEach((lang) =>
    url.searchParams.append("to", languageToCodeMap[lang])
  );
  url.searchParams.append("from", languageToCodeMap[sourceLanguage]);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(texts.map((text) => ({ text }))),
    });

    if (!response.ok) {
      throw new APIError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data: TranslationResponse[] = await response.json();
    const translations: Partial<Record<Language, string[]>> = {};

    // Initialize arrays for each target language
    targetLanguages.forEach((lang) => {
      translations[lang] = [];
    });

    data.forEach((item, index) => {
      item.translations.forEach((translation) => {
        const language = codeToLanguageMap[translation.to];
        if (translations[language]) {
          translations[language]![index] = translation.text;
        }
      });
    });

    return {
      original: texts,
      translations: translations,
    };
  } catch (error) {
    console.error(
      "Translation error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new TranslationError("Failed to translate texts");
  }
}

/**
 * Generates the OpenAPI definition for the translation API.
 * @param registry - The OpenAPI registry
 */
export async function generateTranslationApiOpenApiDefinition(
  registry: OpenAPIRegistry
) {
  const LanguageEnum = z.enum([
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

  const SingleTranslationRequestSchema = z.object({
    text: z.string().describe("The text to be translated"),
    sourceLanguage: LanguageEnum.describe("The source language of the text"),
    targetLanguages: z.array(LanguageEnum).describe("Target languages"),
  });

  const BatchTranslationRequestSchema = z.object({
    texts: z.array(z.string()).describe("Array of texts to translate"),
    sourceLanguage: LanguageEnum.describe("The source language"),
    targetLanguages: z.array(LanguageEnum).describe("Target languages"),
  });

  const SingleTranslationResponseSchema = z.object({
    original: z.string(),
    translations: z.record(LanguageEnum, z.string()),
  });

  const BatchTranslationResponseSchema = z.object({
    original: z.array(z.string()),
    translations: z.record(LanguageEnum, z.array(z.string())),
  });

  registry.register("SingleTranslationRequest", SingleTranslationRequestSchema);
  registry.register("BatchTranslationRequest", BatchTranslationRequestSchema);
  registry.register(
    "SingleTranslationResponse",
    SingleTranslationResponseSchema
  );
  registry.register("BatchTranslationResponse", BatchTranslationResponseSchema);

  registry.registerPath({
    method: "post",
    path: "/" + APPNAME + "/api/translate",
    description: "Translate text to multiple languages",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.union([
              SingleTranslationRequestSchema,
              BatchTranslationRequestSchema,
            ]),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successful translation",
        content: {
          "application/json": {
            schema: z.union([
              SingleTranslationResponseSchema,
              BatchTranslationResponseSchema,
            ]),
          },
        },
      },
      400: {
        description: "Bad request",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });
}
