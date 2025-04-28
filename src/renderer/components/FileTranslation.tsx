import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TranslateIcon from '@mui/icons-material/Translate';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';
import { selectFile, selectDirectory } from '../utils/ipc';
import { readExcelFile, isExcelFile, ExcelData } from '../utils/excel';
import type { LingoDotDevEngine } from '@lingo.dev/_sdk';
import * as XLSX from 'xlsx';
import { translate } from '../../config/lingo';

interface FileTranslationProps {
  selectedLanguages: string[];
  languageOptions: Array<{ code: string; label: string }>;
  onLanguageToggle: (event: React.MouseEvent<HTMLElement>, newLanguages: string[]) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  sourceFile: string;
  orientation: 'row' | 'column';
  onOrientationChange: (value: 'row' | 'column') => void;
  onFileSelect: () => Promise<void>;
  lingoClient: LingoDotDevEngine | null;
  excelData: ExcelData | null;
}

// 工具函數：二維陣列轉置
function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

const FileTranslation: React.FC<FileTranslationProps> = ({
  selectedLanguages,
  languageOptions,
  onLanguageToggle,
  onSelectAll,
  onClearAll,
  sourceFile,
  orientation,
  onOrientationChange,
  onFileSelect,
  lingoClient,
  excelData,
}) => {
  const { t } = useTranslation();
  const [translatedExcelData, setTranslatedExcelData] = React.useState<any[][] | null>(null);
  const [isTranslating, setIsTranslating] = React.useState(false);

  // 清空翻譯結果（切換檔案或來源時）
  React.useEffect(() => {
    setTranslatedExcelData(null);
    // eslint-disable-next-line
  }, [excelData, sourceFile]);

  const handleDirectorySelect = async () => {
    const dirPath = await selectDirectory();
    if (dirPath) {
      console.log('Selected directory:', dirPath);
    }
  };

  const handleTranslate = async () => {
    if (!excelData || !lingoClient) return;
    setIsTranslating(true);
    try {
      // 只處理第一個 sheet
      const firstSheet = Object.values(excelData.sheets)[0];
      if (!firstSheet) {
        console.log('No sheet found in excelData:', excelData);
        return;
      }
      let data = firstSheet.data.map(row => [...row]); // deep copy
      if (data.length === 0) {
        console.log('Sheet data is empty:', firstSheet);
        return;
      }

      let header: any[];
      let langColMap: Record<string, number> = {};
      let isTransposed = false;

      if (orientation === 'column') {
        data = transpose(data);
        isTransposed = true;
        console.log('Transposed data for column mode:', data);
      }
      header = data[0];
      header.forEach((lang, idx) => {
        if (typeof lang === 'string') langColMap[lang.trim()] = idx;
      });
      console.log('Header:', header);
      console.log('langColMap:', langColMap);
      const enCol = langColMap['en'];
      const targetCols = selectedLanguages.filter(l => l !== 'en' && langColMap[l] !== undefined).map(l => ({ lang: l, col: langColMap[l] }));
      console.log('Target columns:', targetCols);
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[enCol]) {
          console.log(`Row ${i} en column is empty, stop processing.`);
          break;
        }
        for (const { lang, col } of targetCols) {
          if (!row[col]) {
            try {
              console.log(`Translating row ${i}, en: '${row[enCol]}' -> ${lang}`);
              const translated = await translate(lingoClient, row[enCol], 'en', lang);
              row[col] = translated;
              console.log(`Translated [${i}, ${col}] (${lang}):`, translated);
            } catch (e) {
              row[col] = '';
              console.error(`Translation failed for row ${i}, lang ${lang}:`, e);
            }
          }
        }
      }
      if (isTransposed) {
        data = transpose(data); // 轉回原本格式
        console.log('Transposed back to original format:', data);
      }
      setTranslatedExcelData(data);
      console.log('Final translated data:', data);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExport = () => {
    if (!translatedExcelData) return;
    const ws = XLSX.utils.aoa_to_sheet(translatedExcelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'translated.xlsx');
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Step 1: Language Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('translationTool.languageSelection.title')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ToggleButtonGroup
            value={selectedLanguages}
            onChange={onLanguageToggle}
            aria-label="language selection"
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            {languageOptions.map((lang) => (
              <ToggleButton
                key={lang.code}
                value={lang.code}
                aria-label={lang.label}
              >
                {lang.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={onSelectAll}>
              {t('translationTool.languageSelection.selectAll')}
            </Button>
            <Button variant="outlined" onClick={onClearAll}>
              {t('translationTool.languageSelection.clearAll')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Step 2: File Selection and Settings */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('translationTool.sourceFile.title')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              value={sourceFile}
              placeholder={t('translationTool.sourceFile.placeholder')}
              onClick={onFileSelect}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={onFileSelect}>
                    <DescriptionIcon sx={{ color: '#21a366' }} />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
            {t('translationTool.sourceFile.xlsxOnlyWarning')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={orientation}
              exclusive
              onChange={(e, value) => value && onOrientationChange(value)}
              size="small"
            >
              <ToggleButton value="row">
                {t('translationTool.sourceFile.orientation.row')}
              </ToggleButton>
              <ToggleButton value="column">
                {t('translationTool.sourceFile.orientation.column')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {excelData && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {t('translationTool.sourceFile.sheetsFound', { count: Object.keys(excelData.sheets).length })}
              </Typography>
              {Object.entries(excelData.sheets).map(([sheetName, sheet]) => (
                <Typography key={sheetName} variant="body2" color="textSecondary">
                  {t('translationTool.sourceFile.sheetInfo', { sheetName, rowCount: sheet.rowCount, columnCount: sheet.columnCount })}
                </Typography>
              ))}
            </Box>
          )}
          <Button
            variant="contained"
            startIcon={<TranslateIcon />}
            sx={{ width: '100%', height: '50px', mt: 2 }}
            onClick={handleTranslate}
            disabled={isTranslating || !excelData || !lingoClient}
          >
            {isTranslating ? t('translationTool.textInput.translating') : t('translationTool.sourceFile.startTranslation')}
          </Button>
        </Box>
      </Box>

      {/* Step 3: Output Folder Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('translationTool.output.folder.title')}
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          sx={{ width: '100%', height: '50px' }}
          onClick={handleExport}
          disabled={!translatedExcelData}
        >
          {t('translationTool.output.exportExcel')}
        </Button>
      </Box>
    </Box>
  );
};

export default FileTranslation; 