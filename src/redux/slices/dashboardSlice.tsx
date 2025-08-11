import { getDashboardStatsAsync, getloiDataAsync } from "@/services/dashboard/asyncThunk";
import { createSlice } from "@reduxjs/toolkit";

// Initial state
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
  
  // Error statesp
  error: null,
  leaseError: null,
  loiError: null,
  
  // Success states
  isSuccess: false,
  
  // Last updated
  lastUpdated: null,
};

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {

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
        
        const  data  = action.payload;
        console.log("data", action.payload
        )
        state.totalLease = data?.total_lease;
        state.totalLOI = data?.total_loi;
        state.myLeases = data?.my_lease || [];
        state.myLOIs = data?.my_loi || [];
        state.leasePage = data?.lease_page;
        state.loiPage = data?.loi_page;
        state.leaseLimit = data?.lease_limit;
        state.loiLimit = data?.loi_limit;
      })
      .addCase(getDashboardStatsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
      })

         // Fetch Dashboard Data
      .addCase(getloiDataAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(getloiDataAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.error = null;
        
        const  data  = action.payload;
        console.log("data", action.payload
        )
        state.myLOIs = data?.my_loi || [];
      })
    }
});



export default dashboardSlice.reducer;
