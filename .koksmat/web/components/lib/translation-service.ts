import { LRUCache } from "lru-cache";

// Azure Translator configuration
const AZURE_TRANSLATOR_ENDPOINT =
  "https://api.cognitive.microsofttranslator.com";
const AZURE_TRANSLATOR_REGION_UNDEFINED = process.env.AZURE_TRANSLATOR_REGION;
const AZURE_TRANSLATOR_KEY_UNDEFINED = process.env.AZURE_TRANSLATOR_KEY;

// Check for missing environment variables
if (!AZURE_TRANSLATOR_REGION_UNDEFINED || !AZURE_TRANSLATOR_KEY_UNDEFINED) {
  throw new Error(
    "Missing Azure Translator configuration. Please set the following environment variables:\n" +
      "AZURE_TRANSLATOR_REGION: The region of your Azure Translator resource (e.g., 'eastus')\n" +
      "AZURE_TRANSLATOR_KEY: Your Azure Translator subscription key\n\n" +
      "You can set these variables in your .env.local file or in your deployment environment.\n" +
      "For more information, visit: https://docs.microsoft.com/en-us/azure/cognitive-services/translator/quickstart-translator?tabs=nodejs"
  );
}

// Type assertions after the null checks
const AZURE_TRANSLATOR_REGION = AZURE_TRANSLATOR_REGION_UNDEFINED!;
const AZURE_TRANSLATOR_KEY = AZURE_TRANSLATOR_KEY_UNDEFINED!;

// Custom error types for more specific error handling
class TranslationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationError";
  }
}

class APIError extends Error {
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

// Updated interfaces to use Partial
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
        "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
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
    if (error instanceof APIError) {
      throw error;
    }
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
        "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
        "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
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
    if (error instanceof APIError) {
      throw error;
    }
    console.error(
      "Translation error:",
      error instanceof Error ? error.message : String(error)
    );
    throw new TranslationError("Failed to translate texts");
  }
}
/*
// Example usage
const textToTranslate = "Hello, how are you?";
const textsToTranslate = ["Hello, how are you?", "The weather is nice today."];
const sourceLanguage: Language = "English";
const targetLanguages: Language[] = [
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese Simplified",
];

// Single line translation
translateOneline(textToTranslate, sourceLanguage, targetLanguages)
  .then((result) =>
    console.log("Single line translation:", JSON.stringify(result, null, 2))
  )
  .catch((error) => console.error(error));

// Batch translation
translateBatch(textsToTranslate, sourceLanguage, targetLanguages)
  .then((result) =>
    console.log("Batch translation:", JSON.stringify(result, null, 2))
  )
  .catch((error) => console.error(error));
*/
/*
Note on Internationalization (i18n):
When using this translation service in a larger application, consider the following i18n implications:
1. Ensure that your application's UI can handle right-to-left (RTL) languages if you're translating into Arabic, Hebrew, etc.
2. Be aware of potential text expansion or contraction when translating between languages, which may affect your UI layout.
3. Consider using a proper i18n library (like react-i18next for React applications) for managing translations throughout your application.
4. Remember that machine translation may not always be perfect, especially for context-dependent or idiomatic expressions.
*/

import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { APPNAME } from "@/app/global";

export async function generateTranslationApiOpenApiDefinition(
  registry: OpenAPIRegistry
) {
  // Define the Language enum
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

  // Define the request body schema for single text translation
  const SingleTranslationRequestSchema = z.object({
    text: z.string().describe("The text to be translated"),
    sourceLanguage: LanguageEnum.describe("The source language of the text"),
    targetLanguages: z
      .array(LanguageEnum)
      .describe("An array of target languages for translation"),
  });

  // Define the request body schema for batch text translation
  const BatchTranslationRequestSchema = z.object({
    texts: z.array(z.string()).describe("An array of texts to be translated"),
    sourceLanguage: LanguageEnum.describe("The source language of the texts"),
    targetLanguages: z
      .array(LanguageEnum)
      .describe("An array of target languages for translation"),
  });

  // Define the response schema for single text translation
  const SingleTranslationResponseSchema = z.object({
    original: z.string(),
    translations: z.record(LanguageEnum, z.string()),
  });

  // Define the response schema for batch text translation
  const BatchTranslationResponseSchema = z.object({
    original: z.array(z.string()),
    translations: z.record(LanguageEnum, z.array(z.string())),
  });

  // Register the schemas
  registry.register("SingleTranslationRequest", SingleTranslationRequestSchema);
  registry.register("BatchTranslationRequest", BatchTranslationRequestSchema);
  registry.register(
    "SingleTranslationResponse",
    SingleTranslationResponseSchema
  );
  registry.register("BatchTranslationResponse", BatchTranslationResponseSchema);

  // Define the translation endpoint
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

// Example usage:
// const registry = new OpenAPIRegistry();
// const openApiDefinition = generateTranslationApiOpenApiDefinition(registry);
// console.log(JSON.stringify(openApiDefinition, null, 2));
