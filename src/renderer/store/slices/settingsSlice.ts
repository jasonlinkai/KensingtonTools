import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  apiKey: string;
  // 可以在這裡添加其他設定項
  // theme: 'light' | 'dark';
  // language: string;
  // etc...
}

const initialState: SettingsState = {
  apiKey: localStorage.getItem('apiKey') || '',
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
    // 可以在這裡添加其他設定的 reducers
    // setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
    //   state.theme = action.payload;
    // },
  },
});

export const { setApiKey, clearApiKey } = settingsSlice.actions;
export const selectApiKey = (state: { settings: SettingsState }) => state.settings.apiKey;
export default settingsSlice.reducer; 