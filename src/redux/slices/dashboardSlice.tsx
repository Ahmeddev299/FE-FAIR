// src/redux/slices/dashboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchRealLoiDataAsync, getDashboardStatsAsync, getLoggedInUserAsync, getloiDataAsync, updateLoggedInUserAsync } from "@/services/dashboard/asyncThunk";

/** Replace with your real shapes as they evolve */
export type LeaseSummary = {
  id?: string;
  _id?: string;
  lease_id?: string;
  lease_title?: string;
  title?: string;
  property_address?: string;
  propertyAddress?: string;
  status?: string;
  updatedAt?: string;
  endDate?: string;
  startDate?: string;
  last_updated_date?: string;
  documents?: Array<{ url?: string }>;
  url?: string;
  document_url?: string;
};

export type LoggedInUser = {
  // The API sometimes sends {} for id, so allow an object too
  id?: string | Record<string, unknown>;
  _id?: string;

  // Names
  name?: string;        // legacy/optional
  fullName?: string;

  // Contact
  email?: string;

  // Auth / status
  role?: "tenant" | "admin" | "manager" | string;
  verified_email?: boolean;
  social?: boolean;
  blocked?: boolean;
  session_token?: string;
  otp?: number;

  // Timestamps (ISO strings)
  created_at?: string;
  updated_at?: string;
};

export type LoiSummary = {
  id?: string;
  _id?: string;
  title?: string;
  propertyAddress?: string;
  property_address?: string;
  status?: string;
  endDate: number;
  startDate: number;
  submit_status?: string;
  updatedAt?: string;
  createdAt?: string;
  user_name?: string;
  partyInfo?: unknown;
  leaseTerms?: unknown;
  additionalDetails?: unknown;
  propertyDetails?: unknown;
};

type DashboardError = string | null;

export type DashboardData = {
  total_lease?: number;
  total_loi?: number;
  my_lease?: LeaseSummary[];
  my_loi?: LoiSummary[];
  lease_page?: number;
  loi_page?: number;
  lease_limit?: number;
  loi_limit?: number;
};

type DashboardState = {
  // Data
  totalLease: number;
  totalLOI: number;
  myLeases: LeaseSummary[] | null;
  myLOIs: LoiSummary[] | null;

  isUpdatingUser: boolean;        // <-- add
  updateUserError: DashboardError; // <-- add

  // Pagination
  leasePage: number;
  loiPage: number;
  leaseLimit: number;
  loiLimit: number;

  loggedInUser: LoggedInUser | null;
  isLoadingUser: boolean;
  userError: DashboardError;

  // Loading states
  isLoading: boolean;
  isLoadingLeases: boolean;
  isLoadingLOIs: boolean;

  // Error states
  error: DashboardError;
  leaseError: DashboardError;
  loiError: DashboardError;

  // Success states
  isSuccess: boolean;

  // Last updated
  lastUpdated: string | null;

  isDownloadingLoi: boolean;
  downloadLoiError: string | null;
  lastFetchedLoiData: unknown | null; // what the API returned most recently
};

const initialState: DashboardState = {
  totalLease: 0,
  totalLOI: 0,
  myLeases: null,
  myLOIs: null,
  isUpdatingUser: false,
  updateUserError: null,
  leasePage: 1,
  loiPage: 1,
  leaseLimit: 5,
  loiLimit: 5,
  isLoading: false,
  isLoadingLeases: false,
  isLoadingLOIs: false,
  error: null,
  leaseError: null,
  loggedInUser: null,
  isLoadingUser: false,
  userError: null,
  loiError: null,
  isSuccess: false,
  isDownloadingLoi: false,
  downloadLoiError: null,
  lastFetchedLoiData: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
      state.leaseError = null;
      state.loiError = null;
      state.downloadLoiError = null; // also clear download errors
    },
    clearSuccess(state) {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(getDashboardStatsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(
        getDashboardStatsAsync.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.error = null;
          state.lastUpdated = new Date().toISOString();

          const data = action.payload;
          state.totalLease = data?.total_lease ?? 0;
          state.totalLOI = data?.total_loi ?? 0;
          state.myLeases = data?.my_lease ?? [];
          state.myLOIs = data?.my_loi ?? [];
          state.leasePage = data?.lease_page ?? 1;
          state.loiPage = data?.loi_page ?? 1;
          state.leaseLimit = data?.lease_limit ?? 5;
          state.loiLimit = data?.loi_limit ?? 5;
        }
      )
      .addCase(
        getDashboardStatsAsync.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.error = action.payload ?? "Failed to fetch dashboard data";
        }
      )

      // LOIs
      .addCase(getloiDataAsync.pending, (state) => {
        state.isLoading = true;
        state.loiError = null;
      })
      .addCase(
        getloiDataAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ my_loi?: LoiSummary[] } | LoiSummary[]>
        ) => {
          state.isLoading = false;
          state.loiError = null;

          // support both shapes: { my_loi: [...] } OR just [...]
          const payload = action.payload;
          state.myLOIs = Array.isArray(payload) ? payload : payload?.my_loi ?? [];
        }
      )
      .addCase(
        getloiDataAsync.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.loiError = action.payload ?? "Failed to fetch LOI data";
        }
      )

      .addCase(getLoggedInUserAsync.pending, (state) => {
        state.isLoadingUser = true;
        state.userError = null;
      })
      .addCase(getLoggedInUserAsync.fulfilled, (state, action: PayloadAction<LoggedInUser>) => {
        state.isLoadingUser = false;
        state.loggedInUser = action.payload;
      })
      .addCase(getLoggedInUserAsync.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isLoadingUser = false;
        state.userError = action.payload ?? "Failed to fetch logged-in user";
      })

      // Update logged-in user
      .addCase(updateLoggedInUserAsync.pending, (state) => {
        state.isUpdatingUser = true;
        state.updateUserError = null;
      })
      .addCase(updateLoggedInUserAsync.fulfilled, (state, action: PayloadAction<LoggedInUser>) => {
        state.isUpdatingUser = false;
        state.loggedInUser = {
          ...state.loggedInUser,
          ...action.payload, // merge to reflect updates
        };
      })
      .addCase(updateLoggedInUserAsync.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isUpdatingUser = false;
        state.updateUserError = action.payload ?? "Failed to update profile";
      })

      // NEW: fetchRealLoiDataAsync
      .addCase(fetchRealLoiDataAsync.pending, (state) => {
        state.isDownloadingLoi = true;
        state.downloadLoiError = null;
      })
      .addCase(fetchRealLoiDataAsync.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.isDownloadingLoi = false;
        state.lastFetchedLoiData = action.payload;
      })
      .addCase(fetchRealLoiDataAsync.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.isDownloadingLoi = false;
        state.downloadLoiError = action.payload ?? "Failed to prepare LOI for download";
      });

  }

});

export const { clearErrors, clearSuccess } = dashboardSlice.actions;
export default dashboardSlice.reducer;
