
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadLeaseAsync,
  submitLeaseAsync,
  getallUserLeasesAsync,
  getUserLeasesAsync,
  getClauseDetailsAsync,
  updateClauseCurrentVersionAsync,
  acceptClauseSuggestionAsync,
  getLeaseDetailsById,
  approveLoiClauseApi,
  rejectLoiClauseApi,
  updateLandlordClauseCurrentVersionAsync,
} from "@/services/lease/asyncThunk";
import Toast from "@/components/Toast";

type LeaseItem = {
  lease_id: string | number;
  lease_title: string;
};

type LeaseList = {
  data: LeaseItem[];
  meta?: Record<string, any>;
};

type CurrentLease = Record<string, any>;

type LeaseState = {
  isLoading: boolean;
  submitSuccess: boolean;
  hasFetched: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  leaseError: string;
  currentLease: CurrentLease;
  leaseList: LeaseList | null;
  metaData: Record<string, any>;
  filters: Record<string, any>;
  loadMore: boolean;
};

const initialState: LeaseState = {
  isLoading: false,
  submitSuccess: false,
  hasFetched: false,
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
  leaseList: null,
  metaData: {},
  filters: {},
  loadMore: false,
};

export const leaseSlice = createSlice({
  name: "lease",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.leaseError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Lease (JSON)
      .addCase(submitLeaseAsync.pending, (state) => {
        state.isLoading = true;
        state.submitSuccess = false;
        state.leaseError = "";
      })
      .addCase(submitLeaseAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submitSuccess = true;
        state.currentLease = (action.payload as any) ?? state.currentLease;
        Toast.fire({ icon: "success", title: "Lease submitted successfully!" });
      })
      .addCase(submitLeaseAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.submitSuccess = false;
        state.leaseError = (action.payload as string) ?? "Lease submission failed";
        Toast.fire({ icon: "error", title: state.leaseError });
      })

      // Upload Lease (multipart)
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
        state.leaseError = (action?.payload as string) ?? "Upload failed";
        Toast.fire({ icon: "error", title: state.leaseError });
      })

      .addCase(getUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        const data: LeaseItem[] = Array.isArray(payload)
          ? payload
          : payload?.leases ?? payload?.data ?? [];
        const meta = payload?.meta ?? {};
        state.leaseList = { data, meta };
        state.metaData = meta;
      })
      .addCase(getUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = (action.payload as string) ?? "Failed to fetch leases";
      })

      .addCase(getallUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getallUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        const payload = action.payload as any;
        const data: LeaseItem[] = Array.isArray(payload)
          ? payload
          : payload?.leases ?? payload?.data ?? [];
        const meta = payload?.meta ?? {};
        state.leaseList = { data, meta };
        Toast.fire({ icon: "success", title: "Lease fetched successfully!" });
      })
      .addCase(getallUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        state.leaseError = (action.payload as string) ?? "Failed to fetch leases";
      })

      .addCase(getClauseDetailsAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getClauseDetailsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLease = action.payload as CurrentLease;
      })
      .addCase(getClauseDetailsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = (action.payload as string) ?? "Failed to fetch clause details";
      })

      .addCase(getLeaseDetailsById.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getLeaseDetailsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseError = "";
        state.currentLease = action.payload as CurrentLease;
        Toast.fire({ icon: "success", title: "Lease Clause Fetched Successfully!" });
      })
      .addCase(getLeaseDetailsById.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = (action.payload as string) ?? "Failed to fetch lease";
      })

      .addCase(updateClauseCurrentVersionAsync.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload as { clause_key: string; details: string };
        const history = state.currentLease?.data?.history;
        if (history?.[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "pending",
          };
        }
      })
      .addCase(updateClauseCurrentVersionAsync.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to save clause" });
      })

      .addCase(updateLandlordClauseCurrentVersionAsync.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload as { clause_key: string; details: string };
        const history = state.currentLease?.data?.history;
        if (history?.[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "pending",
          };
        }
      })
      .addCase(updateLandlordClauseCurrentVersionAsync.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to save clause" });
      })

      .addCase(acceptClauseSuggestionAsync.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload as any;
        const history = (state.currentLease as any)?.data?.history;
        if (history && history[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "approved",
          };
        }
        Toast.fire({ icon: "success", title: "AI suggestion accepted successfully!" });
      })
      .addCase(acceptClauseSuggestionAsync.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to accept suggestion" });
      })

      .addCase(approveLoiClauseApi.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload as any;
        const history = (state.currentLease as any)?.data?.history;
        if (history && history[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "approved",
          };
        }
        Toast.fire({ icon: "success", title: "Clause approved" });
      })
      .addCase(approveLoiClauseApi.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to approve clause" });
      })

      .addCase(rejectLoiClauseApi.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload as any;
        const history = (state.currentLease as any)?.data?.history;
        if (history && history[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "rejected",
          };
        }
        Toast.fire({ icon: "success", title: "Clause rejected" });
      })
      .addCase(rejectLoiClauseApi.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to reject clause" });
      });
  },
});

export const { setLoading, setError } = leaseSlice.actions;
export const selectLease = (state: any) => state.lease;
export default leaseSlice.reducer;
