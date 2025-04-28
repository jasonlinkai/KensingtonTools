import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApiKeyState {
  key: string;
}

const initialState: ApiKeyState = {
  key: localStorage.getItem('apiKey') || '',
};

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.key = action.payload;
      localStorage.setItem('apiKey', action.payload);
    },
    clearApiKey: (state) => {
      state.key = '';
      localStorage.removeItem('apiKey');
    },
  },
});

export const { setApiKey, clearApiKey } = apiKeySlice.actions;
export const selectApiKey = (state: { apiKey: ApiKeyState }) => state.apiKey.key;
export default apiKeySlice.reducer; 