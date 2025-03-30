import { configureStore } from '@reduxjs/toolkit';
import wordCacheReducer from '../features/wordCache/wordCacheSlice';

export const store = configureStore({
  reducer: {
    wordCache: wordCacheReducer,
    // Add other reducers here if needed
  },
});