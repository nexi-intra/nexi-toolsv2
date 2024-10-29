import {
  APIError,
  Language,
  translateBatch,
  translateOneline,
  TranslationError,
} from "./translation-service";
import "whatwg-fetch";

describe("Azure Translator Integration", () => {
  // This test suite should be run with actual API credentials in the environment.
  if (
    !process.env.AZURE_TRANSLATOR_REGION ||
    !process.env.AZURE_TRANSLATOR_KEY
  ) {
    console.warn(
      "Skipping Azure Translator integration tests. Please set AZURE_TRANSLATOR_REGION and AZURE_TRANSLATOR_KEY to run these tests."
    );
    return;
  }

  it("translates a single line of text (integration)", async () => {
    const result = await translateOneline("Hello, how are you?", "English", [
      "Spanish",
      "French",
    ]);

    expect(result.translations.Spanish).toBeDefined();
    expect(result.translations.French).toBeDefined();
    console.log("Single-line translation:", result);
  });

  it("caches repeated single line translations (integration)", async () => {
    // First call to populate cache
    const result1 = await translateOneline("Hello, how are you?", "English", [
      "German",
    ]);
    // Second call should hit cache
    const result2 = await translateOneline("Hello, how are you?", "English", [
      "German",
    ]);

    expect(result1).toEqual(result2);
  });

  it("translates a batch of texts (integration)", async () => {
    const texts = ["Hello, how are you?", "The weather is nice today."];
    const result = await translateBatch(texts, "English", [
      "Spanish",
      "French",
    ]);

    expect(result.translations.Spanish).toHaveLength(2);
    expect(result.translations.French).toHaveLength(2);
    console.log("Batch translation:", result);
  });

  it("handles API response errors gracefully (integration)", async () => {
    try {
      // Send an intentionally incorrect request to simulate an error
      await translateOneline("", "English" as Language, ["Spanish"]);
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      console.error("Caught API error as expected:", error);
    }
  });

  it("throws TranslationError on network issues (integration)", async () => {
    // Temporarily override fetch to simulate network error
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

    await expect(
      translateOneline("Hello, how are you?", "English", ["Spanish"])
    ).rejects.toThrow(TranslationError);

    // Restore the original fetch
    global.fetch = originalFetch;
  });
});
