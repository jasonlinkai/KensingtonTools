import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  apiKey: string;
  theme: 'light' | 'dark';
  // 可以在這裡添加其他設定項
  // language: string;
  // etc...
}

const initialState: SettingsState = {
  apiKey: localStorage.getItem('apiKey') || '',
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      localStorage.setItem('apiKey', action.payload);
    },
    clearApiKey: (state) => {
      state.apiKey = '';
      localStorage.removeItem('apiKey');
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    // 可以在這裡添加其他設定的 reducers
    // setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
    //   state.theme = action.payload;
    // },
  },
});

export const { setApiKey, clearApiKey, setTheme } = settingsSlice.actions;
export const selectApiKey = (state: { settings: SettingsState }) => state.settings.apiKey;
export const selectTheme = (state: { settings: SettingsState }) => state.settings.theme;
export default settingsSlice.reducer; 