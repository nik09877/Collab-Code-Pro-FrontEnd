import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import toolsReducer from './toolsSlice';
import contestReducer from './contestSlice';
import whiteboardReducer from './whiteboardSlice';
import cursorSliceReducer from './cursorSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
    contest: contestReducer,
    whiteboard: whiteboardReducer,
    cursor: cursorSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //we shouldn't store the classes
        //returned by generateRectangle()
        //but we are storing it because it still works
        ignoreActions: ['whiteboard/setElements'],
        ignoredPaths: ['whiteboard.elements'],
      },
    }),
});
