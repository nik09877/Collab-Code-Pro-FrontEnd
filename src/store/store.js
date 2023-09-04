import { configureStore } from '@reduxjs/toolkit';
import toolsReducer from './toolsSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
  },
});
