import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loiReducer from './slices/loiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    loi: loiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
