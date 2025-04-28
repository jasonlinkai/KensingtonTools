import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import './i18n';
import App from './App';
import { store } from './store/store';
import { useSelector } from 'react-redux';
import { selectTheme } from './store/slices/settingsSlice';

function ThemedApp() {
  const themeMode = useSelector(selectTheme);
  const theme = React.useMemo(() => createTheme({
    palette: { mode: themeMode },
  }), [themeMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
); 