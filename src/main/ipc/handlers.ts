import { ipcMain, dialog, app } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc';
import { readExcelFile } from '../utils/excel';
import { lingoLocalizeObject } from '../utils/lingo';

// 註冊所有 IPC 處理程序
export function registerIpcHandlers() {
  // 選擇檔案
  ipcMain.handle(IPC_CHANNELS.SELECT_FILE, async (event, options?: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
        { name: 'JSON Files', extensions: ['json'] }
      ],
      ...options
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // 選擇目錄
  ipcMain.handle(IPC_CHANNELS.SELECT_DIRECTORY, async (event, options?: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      ...options
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // 讀取 Excel 檔案
  ipcMain.handle(IPC_CHANNELS.READ_EXCEL_FILE, async (event, filePath: string) => {
    try {
      const data = readExcelFile(filePath);
      return data;
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw error;
    }
  });

  // Lingo 批次翻譯
  ipcMain.handle(IPC_CHANNELS.LINGO_LOCALIZE_OBJECT, async (event, obj, params) => {
    const result = await lingoLocalizeObject(
      obj,
      params,
      (progress, sourceChunk, processedChunk) => {
        console.log('[lingoLocalizeObject] Progress:', progress);
        console.log('[lingoLocalizeObject] Source chunk:', sourceChunk);
        console.log('[lingoLocalizeObject] Processed chunk:', processedChunk);
        event.sender.send('lingo-localize-progress', {
          progress,
          sourceChunk,
          processedChunk
        });
      }
    );
    console.log('[lingoLocalizeObject] Result:', result);
    return result;
  });

  // Lingo 單句翻譯
  ipcMain.handle(IPC_CHANNELS.LINGO_TRANSLATE_TEXT, async (event, text, targetLocale) => {
    const { lingoTranslateText } = await import('../utils/lingo');
    return await lingoTranslateText(text, targetLocale);
  });

  // Lingo 設定 API Key
  ipcMain.handle(IPC_CHANNELS.LINGO_SET_API_KEY, async (_event, apiKey) => {
    const { setLingoApiKey } = await import('../utils/lingo');
    setLingoApiKey(apiKey);
    return true;
  });

  // 系統語言
  ipcMain.handle(IPC_CHANNELS.GET_SYSTEM_LANGUAGE, async () => {
    return app.getLocale();
  });
} 