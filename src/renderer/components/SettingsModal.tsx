import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLingoDevApiKey, selectLingoDevApiKey } from '../store/slices/settingsSlice';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLingoDevApiKey = useSelector(selectLingoDevApiKey);
  const [lingoDevApiKey, setLingoDevApiKeyInput] = useState(currentLingoDevApiKey);

  const handleSave = async () => {
    dispatch(setLingoDevApiKey(lingoDevApiKey.trim()));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('apiKey.title')}
          </Typography>
          <TextField
            fullWidth
            type="password"
            value={lingoDevApiKey}
            onChange={(e) => setLingoDevApiKeyInput(e.target.value)}
            placeholder={t('apiKey.placeholder')}
            margin="normal"
            label={t('apiKey.label')}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            {t('apiKey.note')}
          </Typography>
        </Box>
        
        {/* 可以在這裡添加其他設定項
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t('settings.theme.title')}
          </Typography>
          ...
        </Box> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!lingoDevApiKey.trim()}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal; 