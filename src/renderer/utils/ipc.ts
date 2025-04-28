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