import * as XLSX from 'xlsx';

export interface ExcelData {
  sheets: {
    [sheetName: string]: {
      data: any[][];
      rowCount: number;
      columnCount: number;
    };
  };
}

export function readExcelFile(filePath: string): ExcelData {
  try {
    // 讀取 Excel 檔案
    const workbook = XLSX.readFile(filePath);
    const result: ExcelData = { sheets: {} };

    // 處理每個工作表
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // 將工作表轉換為二維陣列
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      // 計算實際的行數和列數（排除空行和空列）
      let maxRow = 0;
      let maxCol = 0;
      
      data.forEach((row: any[], rowIndex: number) => {
        if (row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
          maxRow = rowIndex + 1;
          const rowLength = row.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
          maxCol = Math.max(maxCol, rowLength);
        }
      });

      result.sheets[sheetName] = {
        data,
        rowCount: maxRow,
        columnCount: maxCol
      };
    });

    return result;
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