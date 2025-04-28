import { LingoDotDevEngine } from '@lingo.dev/_sdk';

let lingoClient: LingoDotDevEngine | null = null;
let currentLingoDevApiKey: string | null = null;

export function setLingoApiKey(lingoDevApiKey: string) {
  if (!lingoClient || lingoDevApiKey !== currentLingoDevApiKey) {
    lingoClient = new LingoDotDevEngine({ apiKey: lingoDevApiKey });
    currentLingoDevApiKey = lingoDevApiKey;
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