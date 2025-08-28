/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import Toast from "@/components/Toast";
import { 
  uploadLeaseAsync,
  getallUserLeasesAsync,
  getUserLeasesAsync,
  getClauseDetailsAsync,
  getLeaseDetailsById 
} from "@/services/lease/asyncThunk";

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
    },
  },
  extraReducers: (builder) => {
    // Upload lease
    builder
      .addCase(uploadLeaseAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(uploadLeaseAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.submitSuccess = true;
        Toast.fire({ icon: "success", title: "Lease uploaded successfully!" });
      })
      .addCase(uploadLeaseAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      });

    // Get paginated user leases (/clause/get_user_leases)
    builder
      .addCase(getUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseList = action.payload?.leases ?? action.payload;
        state.metaData = action.payload?.meta ?? {};
      })
      .addCase(getUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = action.payload as string;
      });

    // Get all user leases (if you have a separate API)
    builder
      .addCase(getallUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getallUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseList = action.payload;
      })
      .addCase(getallUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = action.payload as string;
      });

    // Clause details
    builder
      .addCase(getClauseDetailsAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getClauseDetailsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLease = action.payload;
      })
      .addCase(getClauseDetailsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = action.payload as string;
      });

    // Lease details by ID
    builder
      .addCase(getLeaseDetailsById.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getLeaseDetailsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLease = action.payload;
      })
      .addCase(getLeaseDetailsById.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = action.payload as string;
      });
  },
});

export const { setLoading, setError } = leaseSlice.actions;

export const selectLease = (state: any) => state.lease;

export default leaseSlice.reducer;
