import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setApiKey, selectApiKey } from '../store/slices/apiKeySlice';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentApiKey = useSelector(selectApiKey);
  const [apiKey, setApiKeyInput] = useState(currentApiKey);

  const handleSave = () => {
    dispatch(setApiKey(apiKey.trim()));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('apiKey.title')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type="password"
          value={apiKey}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder={t('apiKey.placeholder')}
          margin="normal"
          label={t('apiKey.label')}
        />
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
          {t('apiKey.note')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!apiKey.trim()}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyModal; 