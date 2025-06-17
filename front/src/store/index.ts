import { configureStore } from '@reduxjs/toolkit';
import fileManagerReducer from './fileManagerSlice';

export const store = configureStore({
  reducer: {
    fileManager: fileManagerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
