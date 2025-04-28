import React from 'react';
import { AppBar, Toolbar, Button, Box, Select, MenuItem, SelectChangeEvent, Switch, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setTheme } from '../store/slices/settingsSlice';

const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const themeMode = useSelector(selectTheme);
  const dispatch = useDispatch();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(themeMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            {t('navigation.home')}
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/translate"
          >
            {t('navigation.translate')}
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
          >
            {t('navigation.about')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={themeMode === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}>
            <Switch
              checked={themeMode === 'dark'}
              onChange={handleThemeToggle}
              color="default"
              icon={<Brightness7Icon />}
              checkedIcon={<Brightness4Icon />}
              inputProps={{ 'aria-label': 'theme switch' }}
            />
          </Tooltip>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            size="small"
            sx={{ 
              color: 'inherit',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '.MuiSvgIcon-root': { color: 'inherit' }
            }}
          >
            <MenuItem value="en">{t('language.en')}</MenuItem>
            <MenuItem value="zh">{t('language.zh')}</MenuItem>
            <MenuItem value="zh-TW">{t('language.zh-TW')}</MenuItem>
            <MenuItem value="ja">{t('language.ja')}</MenuItem>
            <MenuItem value="ko">{t('language.ko')}</MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 