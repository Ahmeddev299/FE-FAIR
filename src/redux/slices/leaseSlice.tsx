/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import Toast from "@/components/Toast";
import { uploadLeaseAsync, getUserLeasesAsync } from "@/services/lease/asyncThunk";

export const leaseSlice = createSlice({
  name: "lease",
  initialState: {
    isLoading: false,
    submitSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    leaseError: "",
    currentLease: {
      userId: "",
      name: "",
      docType: "application/pdf",
      url: "",
      lease_title: "",
      startDate: null,
      endDate: null,
      property_address: "",
      notes: "",
      type: "lease",
      status: "",
      action: "",
      risk: "",
      comments: "",
      clauses: {},
    },
    leaseList: [],
    metaData: {},
    filters: {},
    loadMore: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.leaseError = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadLeaseAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(uploadLeaseAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.submitSuccess = true;
      })
      .addCase(uploadLeaseAsync.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getUserLeasesAsync.fulfilled, (state , action) => {
        state.isLoading = false;
        state.leaseList = action.payload;
      })
      .addCase(getUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
          state.leaseError = "";
      })
  },
});

export const {
  setLoading,
  setError,
} = leaseSlice.actions;

export const selectLease = (state: any) => state.lease;

export default leaseSlice.reducer;
