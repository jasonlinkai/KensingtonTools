import { IPC_CHANNELS } from '../../shared/constants/ipc';

// 由於 contextBridge 的限制，我們需要從 window 物件取得 electron
const electron = (window as any).electron;

// 檔案選擇器
export async function selectFile(options?: Electron.OpenDialogOptions): Promise<string | null> {
  return await electron.ipcRenderer.invoke(IPC_CHANNELS.SELECT_FILE, options);
}

// 目錄選擇器
export async function selectDirectory(options?: Electron.OpenDialogOptions): Promise<string | null> {
  return await electron.ipcRenderer.invoke(IPC_CHANNELS.SELECT_DIRECTORY, options);
}

// Lingo 批次翻譯，支援進度監聽
export async function lingoLocalizeObject(
  obj: Record<string, any>,
  params: { sourceLocale: string; targetLocale: string; fast?: boolean },
  onProgress?: (progress: number, sourceChunk: Record<string, string>, processedChunk: Record<string, string>) => void
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    const electron = (window as any).electron;
    const handler = (data: { progress: number; sourceChunk: Record<string, string>; processedChunk: Record<string, string> }) => {
      console.log('[lingoLocalizeObject] Progress:', data);
      if (onProgress) onProgress(data.progress, data.sourceChunk, data.processedChunk);
    };
    electron.ipcRenderer.on('lingo-localize-progress', handler);
    electron.ipcRenderer.invoke(
      IPC_CHANNELS.LINGO_LOCALIZE_OBJECT,
      obj,
      params
    ).then((result: any) => {
      electron.ipcRenderer.removeListener('lingo-localize-progress', handler);
      resolve(result);
    }).catch((err: any) => {
      electron.ipcRenderer.removeListener('lingo-localize-progress', handler);
      reject(err);
    });
  });
}

export async function lingoTranslateText(text: string, targetLocale: string): Promise<string> {
  const electron = (window as any).electron;
  return await electron.ipcRenderer.invoke(
    IPC_CHANNELS.LINGO_TRANSLATE_TEXT,
    text,
    targetLocale
  );
}

export async function lingoSetApiKey(lingoDevApiKey: string): Promise<void> {
  const electron = (window as any).electron;
  await electron.ipcRenderer.invoke(IPC_CHANNELS.LINGO_SET_API_KEY, lingoDevApiKey);
} 