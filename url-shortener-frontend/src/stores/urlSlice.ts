
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UrlState {
  shortenedUrls: Array<{
    original: string;
    shortened: string;
    createdAt: string;
  }>;
  loading: boolean;
  error: string;
  activeTab: 'shorten' | 'history';
}

const initialState: UrlState = {
  shortenedUrls: [],
  loading: false,
  error: '',
  activeTab: 'shorten',
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    addShortenedUrl: (state, action: PayloadAction<{
      original: string;
      shortened: string;
      createdAt: string;
    }>) => {
      state.shortenedUrls.unshift(action.payload);
    },
    setActiveTab: (state, action: PayloadAction<'shorten' | 'history'>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setLoading, setError, addShortenedUrl, setActiveTab } = urlSlice.actions;
export default urlSlice.reducer;