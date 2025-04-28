import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { LingoDotDevEngine } from '@lingo.dev/_sdk';

interface TextTranslationProps {
  languageOptions: Array<{ code: string; label: string }>;
  lingoClient: LingoDotDevEngine | null;
  isTranslating: boolean;
  detectedLanguage: string | null;
  targetLanguage: string;
  inputText: string;
  translatedText: string;
  onInputTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTargetLanguageChange: (value: string) => void;
  onTranslate: () => void;
}

const TextTranslation: React.FC<TextTranslationProps> = ({
  languageOptions,
  lingoClient,
  isTranslating,
  detectedLanguage,
  targetLanguage,
  inputText,
  translatedText,
  onInputTextChange,
  onTargetLanguageChange,
  onTranslate,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      {/* Input Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('translationTool.textInput.title')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={inputText}
            onChange={onInputTextChange}
            placeholder={t('translationTool.textInput.placeholder')}
          />
          {detectedLanguage && (
            <Typography variant="body2" color="textSecondary">
              {t('translationTool.textInput.detectedLanguage', {
                language: detectedLanguage.toUpperCase()
              })}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="target-language-label">
                {t('translationTool.textInput.targetLanguage')}
              </InputLabel>
              <Select
                labelId="target-language-label"
                value={targetLanguage}
                onChange={(e) => onTargetLanguageChange(e.target.value)}
                label={t('translationTool.textInput.targetLanguage')}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={onTranslate}
              disabled={isTranslating || !lingoClient}
            >
              {isTranslating
                ? t('translationTool.textInput.translating')
                : t('translationTool.textInput.button')}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Translation Results Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('translationTool.textInput.translatedText')}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
              {detectedLanguage && targetLanguage && (
                <>
                  {detectedLanguage.toUpperCase()} → {targetLanguage.toUpperCase()}
                </>
              )}
            </Typography>
            {translatedText && (
              <Button
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(translatedText);
                }}
              >
                {t('common.copy')}
              </Button>
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={translatedText}
            InputProps={{ readOnly: true }}
            placeholder={t('translationTool.textInput.translatedResultPlaceholder')}
            sx={{
              backgroundColor: 'action.hover',
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TextTranslation; 