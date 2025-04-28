import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  lingoDevApiKey: string;
  theme: 'light' | 'dark';
  // 可以在這裡添加其他設定項
  // language: string;
  // etc...
}

const initialState: SettingsState = {
  lingoDevApiKey: localStorage.getItem('lingoDevApiKey') || '',
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLingoDevApiKey: (state, action: PayloadAction<string>) => {
      state.lingoDevApiKey = action.payload;
      localStorage.setItem('lingoDevApiKey', action.payload);
    },
    clearLingoDevApiKey: (state) => {
      state.lingoDevApiKey = '';
      localStorage.removeItem('lingoDevApiKey');
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

export const { setLingoDevApiKey, clearLingoDevApiKey, setTheme } = settingsSlice.actions;
export const selectLingoDevApiKey = (state: { settings: SettingsState }) => state.settings.lingoDevApiKey;
export const selectTheme = (state: { settings: SettingsState }) => state.settings.theme;
export default settingsSlice.reducer; 