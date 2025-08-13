// store/slices/dashboardSlice.ts (Fixed error handling)
import { getDashboardStatsAsync, getloiDataAsync } from "@/services/dashboard/asyncThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Data
  totalLease: 0,
  totalLOI: 0,
  myLeases: [],
  myLOIs: [],
  
  // Pagination
  leasePage: 1,
  loiPage: 1,
  leaseLimit: 5,
  loiLimit: 5,
  
  // Loading states
  isLoading: false,
  isLoadingLeases: false,
  isLoadingLOIs: false,
  
  // Error states
  error: null,
  leaseError: null,
  loiError: null,
  
  // Success states
  isSuccess: false,
  
  // Last updated
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.leaseError = null;
      state.loiError = null;
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(getDashboardStatsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(getDashboardStatsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
        
        const data = action.payload;
        console.log("Dashboard data:", data);
        
        state.totalLease = data?.total_lease || 0;
        state.totalLOI = data?.total_loi || 0;
        state.myLeases = data?.my_lease || [];
        state.myLOIs = data?.my_loi || [];
        state.leasePage = data?.lease_page || 1;
        state.loiPage = data?.loi_page || 1;
        state.leaseLimit = data?.lease_limit || 5;
        state.loiLimit = data?.loi_limit || 5;
      })
      .addCase(getDashboardStatsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string || "Failed to fetch dashboard data";
      })
      
      // Fetch LOI Data
      .addCase(getloiDataAsync.pending, (state) => {
        state.isLoading = true;
        state.loiError = null;
      })
      .addCase(getloiDataAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loiError = null;
        
        const data = action.payload
        console.log("LOI data:", data);
        state.myLOIs = data?.my_loi || [];
      })
      .addCase(getloiDataAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string || "Failed to fetch LOI data";
      });
  }
});

export const { clearErrors, clearSuccess } = dashboardSlice.actions;
export default dashboardSlice.reducer;