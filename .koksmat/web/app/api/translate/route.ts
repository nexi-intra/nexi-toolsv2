import { NextRequest, NextResponse } from "next/server";
import {
  translateOneline,
  translateBatch,
  Language,
} from "@/lib/translation-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, sourceLanguage, targetLanguages } = body;

    // Validate input
    if (!sourceLanguage || !targetLanguages || (!text && !texts)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!Array.isArray(targetLanguages)) {
      return NextResponse.json(
        { error: "targetLanguages must be an array" },
        { status: 400 }
      );
    }

    // Validate language inputs
    if (
      !isValidLanguage(sourceLanguage) ||
      !targetLanguages.every(isValidLanguage)
    ) {
      return NextResponse.json(
        { error: "Invalid language specified" },
        { status: 400 }
      );
    }

    // Single text translation
    if (text) {
      const result = await translateOneline(
        text,
        sourceLanguage as Language,
        targetLanguages as Language[]
      );
      return NextResponse.json(result);
    }

    // Batch text translation
    if (texts) {
      if (!Array.isArray(texts)) {
        return NextResponse.json(
          { error: "texts must be an array for batch translation" },
          { status: 400 }
        );
      }
      const result = await translateBatch(
        texts,
        sourceLanguage as Language,
        targetLanguages as Language[]
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to validate if a language is supported
function isValidLanguage(lang: string): lang is Language {
  const supportedLanguages: Language[] = [
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
  ];
  return supportedLanguages.includes(lang as Language);
}
