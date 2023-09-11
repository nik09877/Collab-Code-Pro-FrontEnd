import { configureStore } from '@reduxjs/toolkit';
import toolsReducer from './toolsSlice';
import contestReducer from './contestSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
    contest: contestReducer,
  },
});
