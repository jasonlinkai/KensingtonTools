import { IPC_CHANNELS } from '../../shared/constants/ipc';

const electron = (window as any).electron;

export interface ExcelData {
  sheets: {
    [sheetName: string]: {
      data: any[][];
      rowCount: number;
      columnCount: number;
    };
  };
}

export async function readExcelFile(filePath: string): Promise<ExcelData> {
  try {
    return await electron.ipcRenderer.invoke(IPC_CHANNELS.READ_EXCEL_FILE, filePath);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}

// 檢查檔案是否為 Excel 檔案
export function isExcelFile(fileName: string): boolean {
  const excelExtensions = ['.xlsx', '.xls', '.csv'];
  const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  return excelExtensions.includes(extension);
} 