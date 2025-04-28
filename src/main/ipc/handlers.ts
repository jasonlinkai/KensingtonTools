import { ipcMain, dialog } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants/ipc';
import { readExcelFile } from '../utils/excel';

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
} 