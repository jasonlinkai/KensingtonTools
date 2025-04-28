import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Alert,
  Select,
  MenuItem,
  Tabs,
  Tab,
  keyframes,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectFile, lingoSetApiKey } from '../utils/ipc';
import { readExcelFile, isExcelFile, ExcelData } from '../utils/excel';
import { lingoTranslateText } from '../utils/ipc';
import FileTranslation from '../components/FileTranslation';
import TextTranslation from '../components/TextTranslation';
import SettingsModal from '../components/SettingsModal';
import { selectLingoDevApiKey } from '../store/slices/settingsSlice';

const languageOptions = [
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'uk', label: 'UK' },
  { code: 'ar', label: 'AR' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
  { code: 'pt', label: 'PT' },
  { code: 'da', label: 'DA' },
  { code: 'no', label: 'NO' },
  { code: 'sv', label: 'SV' },
  { code: 'fi', label: 'FI' },
  { code: 'et', label: 'ET' },
  { code: 'lv', label: 'LV' },
  { code: 'lt', label: 'LT' },
  { code: 'pl', label: 'PL' },
  { code: 'cs', label: 'CS' },
  { code: 'sk', label: 'SK' },
  { code: 'hu', label: 'HU' },
  { code: 'ro', label: 'RO' },
  { code: 'ru', label: 'RU' },
  { code: 'kk_KZ', label: 'KK_KZ' },
  { code: 'tr', label: 'TR' },
  { code: 'el', label: 'EL' },
  { code: 'zh-TW', label: 'ZH-TW' },
  { code: 'zh-CN', label: 'ZH-CN' },
  { code: 'ko', label: 'KO' },
  { code: 'ja', label: 'JA' },
];

// 定義齒輪圖標的動畫
const pulseAndShake = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    color: #1976d2;
  }
  25% {
    transform: scale(1.1) rotate(15deg);
    color: #2196f3;
  }
  50% {
    transform: scale(1) rotate(0deg);
    color: #1976d2;
  }
  75% {
    transform: scale(1.1) rotate(-15deg);
    color: #2196f3;
  }
  100% {
    transform: scale(1) rotate(0deg);
    color: #1976d2;
  }
`;

const TranslationTool: React.FC = () => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const lingoDevApiKey = useSelector(selectLingoDevApiKey);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    languageOptions.map(lang => lang.code)
  );
  const [sourceFile, setSourceFile] = useState<string>('');
  const [orientation, setOrientation] = useState<'row' | 'column'>('row');
  const [inputText, setInputText] = useState<string>('');
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string>('zh-TW');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

  useEffect(() => {
    if (lingoDevApiKey) {
      lingoSetApiKey(lingoDevApiKey);
    }
  }, [lingoDevApiKey]);

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!lingoDevApiKey) {
      setError(t('errors.noApiKey'));
      setIsSettingsOpen(true);
      return;
    }

    if (!inputText.trim()) {
      setError(t('errors.noInputText'));
      return;
    }

    try {
      setIsTranslating(true);
      setError(null);
      const result = await lingoTranslateText(inputText, targetLanguage);
      setTranslatedText(result);
    } catch (err) {
      console.error('Translation error:', err);
      setError(t('errors.translationFailed'));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageToggle = (
    event: React.MouseEvent<HTMLElement>,
    newLanguages: string[],
  ) => {
    setSelectedLanguages(newLanguages);
  };

  const handleSelectAll = () => {
    setSelectedLanguages(languageOptions.map(lang => lang.code));
  };

  const handleClearAll = () => {
    setSelectedLanguages([]);
  };

  const handleFileSelect = async () => {
    try {
      setError(null);
      const filePath = await selectFile();
      
      if (filePath) {
        if (!isExcelFile(filePath)) {
          setError(t('errors.invalidFileType'));
          return;
        }

        setSourceFile(filePath);
        
        // 讀取 Excel 檔案內容
        const data = await readExcelFile(filePath);
        setExcelData(data);
        
        // 可以在這裡處理 Excel 資料，例如：
        console.log('Excel data:', data);
        
        // 顯示第一個工作表的資料
        const firstSheet = Object.values(data.sheets)[0];
        if (firstSheet) {
          console.log('First sheet data:', firstSheet.data);
          console.log('Rows:', firstSheet.rowCount);
          console.log('Columns:', firstSheet.columnCount);
        }
      }
    } catch (err) {
      console.error('Error handling file:', err);
      setError(t('errors.fileReadError'));
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Title and Settings */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: !lingoDevApiKey ? 1 : 3 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {t('translationTool.title')}
          </Typography>
          <IconButton
            onClick={() => setIsSettingsOpen(true)}
            color="primary"
            size="large"
            sx={{
              animation: !lingoDevApiKey ? `${pulseAndShake} 2s infinite` : 'none',
              '&:hover': {
                animation: 'none',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* API Key Warning */}
        {!lingoDevApiKey && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {t('errors.noApiKey')}
              <Typography 
                component="span" 
                sx={{ 
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => setIsSettingsOpen(true)}
              >
                {t('common.clickHere')}
              </Typography>
              {t('errors.toSetApiKey')}
            </Box>
          </Alert>
        )}

        {/* Main Content */}
        <Box sx={{ 
          opacity: lingoDevApiKey ? 1 : 0.5,
          pointerEvents: lingoDevApiKey ? 'auto' : 'none',
          transition: 'opacity 0.3s'
        }}>
          <Paper sx={{ p: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3 }}
            >
              <Tab value="file" label={t('translationTool.sourceFile.title')} />
              <Tab value="text" label={t('translationTool.textInput.title')} />
            </Tabs>

            {activeTab === 'file' && (
              <FileTranslation
                languageOptions={languageOptions}
                selectedLanguages={selectedLanguages}
                onLanguageToggle={handleLanguageToggle}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                sourceFile={sourceFile}
                orientation={orientation}
                onOrientationChange={(value) => setOrientation(value)}
                onFileSelect={handleFileSelect}
                excelData={excelData}
                isTranslating={isTranslating}
              />
            )}

            {activeTab === 'text' && (
              <TextTranslation
                languageOptions={languageOptions}
                isTranslating={isTranslating}
                targetLanguage={targetLanguage}
                inputText={inputText}
                translatedText={translatedText}
                onInputTextChange={handleInputTextChange}
                onTargetLanguageChange={setTargetLanguage}
                onTranslate={handleTranslate}
              />
            )}
          </Paper>
        </Box>

        {/* Settings Modal */}
        <SettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default TranslationTool; 