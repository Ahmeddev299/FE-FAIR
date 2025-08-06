import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loiReducer from './slices/loiSlice';
import leaseReducer from './slices/leaseSlice';
import dashbordReducer from './slices/dashboardSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
    loi: loiReducer,
    lease: leaseReducer,
    dashboard : dashbordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
