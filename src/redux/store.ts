import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loiReducer from './slices/loiSlice';
import leaseReducer from './slices/leaseSlice';
import dashbordReducer from './slices/dashboardSlice';
import clauseReducer from './slices/clauseSlice' 
import partyReducer from "@/redux/slices/partySlice";      // NEW

export const store = configureStore({
  reducer: {
    user: userReducer,
        party: partyReducer,

    loi: loiReducer,
    lease: leaseReducer,
    dashboard : dashbordReducer,
    clause : clauseReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
