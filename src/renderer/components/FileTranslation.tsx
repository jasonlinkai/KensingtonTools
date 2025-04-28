import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TranslateIcon from '@mui/icons-material/Translate';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTranslation } from 'react-i18next';
import { selectDirectory, lingoLocalizeObject } from '../utils/ipc';
import { ExcelData } from '../utils/excel';
import * as XLSX from 'xlsx';

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
  excelData,
}) => {
  const { t } = useTranslation();
  const [translatedExcelData, setTranslatedExcelData] = React.useState<any[][] | null>(null);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentLang, setCurrentLang] = React.useState<string | null>(null);
  const [currentRow, setCurrentRow] = React.useState<number | null>(null);
  const [notify, setNotify] = React.useState({ open: false, message: '' });
  const [currentLangProgress, setCurrentLangProgress] = React.useState(0);

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
    setIsTranslating(true);
    // 前置檢查
    if (!excelData) {
      setNotify({ open: true, message: t('translationTool.notify.noFile') });
      setIsTranslating(false);
      return;
    }
    const firstSheet = Object.values(excelData.sheets)[0];
    if (!firstSheet) {
      setNotify({ open: true, message: t('translationTool.notify.noSheet') });
      setIsTranslating(false);
      return;
    }
    let data = firstSheet.data.map(row => [...row]); // deep copy
    if (data.length === 0) {
      setNotify({ open: true, message: t('translationTool.notify.emptySheet') });
      setIsTranslating(false);
      return;
    }
    let header: any[];
    let langColMap: Record<string, number> = {};
    let isTransposed = false;
    if (orientation === 'column') {
      data = transpose(data);
      isTransposed = true;
    }
    header = data[0];
    header.forEach((lang, idx) => {
      if (typeof lang === 'string') langColMap[lang.trim()] = idx;
    });
    const enCol = langColMap['en'];
    if (enCol === undefined) {
      setNotify({ open: true, message: t('translationTool.notify.noEnColumn') });
      setIsTranslating(false);
      return;
    }
    const targetLangs = selectedLanguages.filter(l => l !== 'en' && langColMap[l] !== undefined);
    if (targetLangs.length === 0) {
      setNotify({ open: true, message: t('translationTool.notify.noTargetLang') });
      setIsTranslating(false);
      return;
    }
    // 準備要翻譯的物件：key 為 row index，value 為 en 內容
    const rowsToTranslate: { [lang: string]: { [rowIdx: number]: string } } = {};
    targetLangs.forEach(lang => { rowsToTranslate[lang] = {}; });
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[enCol]) {
        continue;
      }
      for (const lang of targetLangs) {
        const col = langColMap[lang];
        if (!row[col]) {
          rowsToTranslate[lang][i] = row[enCol];
        }
      }
    }
    const langsToTranslate = targetLangs.filter(lang => Object.keys(rowsToTranslate[lang]).length > 0);
    const totalLangs = langsToTranslate.length;
    let finishedLangs = 0;
    setProgress(0);
    setCurrentLang(null);
    setCurrentRow(null);
    setCurrentLangProgress(0);
    try {
      for (const lang of langsToTranslate) {
        const obj = rowsToTranslate[lang];
        setCurrentLang(lang);
        setCurrentRow(null);
        setCurrentLangProgress(0);
        try {
          const translatedObj = await lingoLocalizeObject(
            obj,
            { sourceLocale: 'en', targetLocale: lang },
            (progress, sourceChunk, _processed) => {
              setCurrentLangProgress(progress / 100);
              const chunkRowIdxs = Object.keys(sourceChunk).map(Number);
              if (chunkRowIdxs.length > 0) {
                setCurrentRow(Math.max(...chunkRowIdxs));
              }
              setProgress(
                ((finishedLangs + progress / 100) / totalLangs) * 100
              );
            }
          );
          finishedLangs++;
          setCurrentLangProgress(1);
          setProgress(((finishedLangs) / totalLangs) * 100);
          for (const rowIdxStr in translatedObj) {
            const rowIdx = Number(rowIdxStr);
            const col = langColMap[lang];
            data[rowIdx][col] = translatedObj[rowIdxStr];
          }
        } catch (err) {
          setNotify({ open: true, message: t('translationTool.notify.translateError') });
          setIsTranslating(false);
          setCurrentLang(null);
          setCurrentRow(null);
          setCurrentLangProgress(0);
          return;
        }
      }
      if (isTransposed) {
        data = transpose(data);
      }
      setTranslatedExcelData(data);
      setProgress(100);
      setCurrentLang(null);
      setCurrentRow(null);
      setCurrentLangProgress(0);
    } catch (err) {
      setNotify({ open: true, message: t('translationTool.notify.translateError') });
    } finally {
      setIsTranslating(false);
      setCurrentLang(null);
      setCurrentRow(null);
      setCurrentLangProgress(0);
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
    <>
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
              disabled={isTranslating || !excelData}
            >
              {isTranslating ? t('translationTool.textInput.translating') : t('translationTool.sourceFile.startTranslation')}
            </Button>
            {isTranslating && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>{progress.toFixed(1)}%</Typography>
                {currentLang && (
                  <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    {t('translationTool.sourceFile.progressDetail', { lang: currentLang.toUpperCase(), row: currentRow ?? '-' })}
                  </Typography>
                )}
              </Box>
            )}
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
      <Snackbar
        open={notify.open}
        autoHideDuration={4000}
        onClose={() => setNotify({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setNotify({ open: false, message: '' })} sx={{ width: '100%' }}>
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileTranslation; 