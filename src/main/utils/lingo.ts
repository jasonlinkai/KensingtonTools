import { LingoDotDevEngine } from '@lingo.dev/_sdk';

let lingoClient: LingoDotDevEngine | null = null;
let currentApiKey: string | null = null;

export function setLingoApiKey(apiKey: string) {
  if (!lingoClient || apiKey !== currentApiKey) {
    lingoClient = new LingoDotDevEngine({ apiKey });
    currentApiKey = apiKey;
  }
}

export async function lingoLocalizeObject(
  obj: Record<string, any>,
  params: { sourceLocale: string; targetLocale: string; fast?: boolean },
  progressCallback?: (progress: number, sourceChunk: Record<string, string>, processedChunk: Record<string, string>) => void
): Promise<Record<string, any>> {
  if (!lingoClient) throw new Error('Lingo client not initialized');
  return await lingoClient.localizeObject(obj, params, progressCallback);
}

export async function lingoTranslateText(
  text: string,
  targetLocale: string
): Promise<string> {
  if (!lingoClient) throw new Error('Lingo client not initialized');
  return await lingoClient.localizeText(text, {
    sourceLocale: null,
    targetLocale,
  });
} 