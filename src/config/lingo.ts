import { LingoDotDevEngine } from '@lingo.dev/_sdk';

/**
 * Create a new Lingo client instance
 * @param lingoDevApiKey The API key for Lingo.dev
 * @returns A new LingoDotDevEngine instance
 */
export function createLingoClient(lingoDevApiKey: string): LingoDotDevEngine {
  return new LingoDotDevEngine({ apiKey: lingoDevApiKey });
}

/**
 * Detect the language of the input text
 * @param client The Lingo client instance
 * @param text The text to analyze
 * @returns The detected language code
 */
export async function detectLanguage(client: LingoDotDevEngine, text: string): Promise<string> {
  return client.recognizeLocale(text);
}

/**
 * Translate text to the target language
 * @param client The Lingo client instance
 * @param text The text to translate
 * @param sourceLocale The source language code (if null, will be auto-detected)
 * @param targetLocale The target language code
 * @returns The translated text
 */
export async function translate(
  client: LingoDotDevEngine,
  text: string,
  sourceLocale: string | null,
  targetLocale: string
): Promise<string> {
  return client.localizeText(text, {
    sourceLocale,
    targetLocale,
  });
}

/**
 * Translate text to multiple languages
 * @param client The Lingo client instance
 * @param text The text to translate
 * @param targetLocales The target language codes
 * @returns The translated text in each language
 */
export async function translateToMultipleLanguages(
  client: LingoDotDevEngine,
  text: string,
  targetLocales: string[]
): Promise<Record<string, string>> {
  const translations = await Promise.all(
    targetLocales.map(async (locale) => {
      const translated = await client.localizeText(text, {
        sourceLocale: 'en',
        targetLocale: locale,
      });
      return [locale, translated];
    })
  );
  return Object.fromEntries(translations);
} 