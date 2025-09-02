// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice } from "@reduxjs/toolkit";
// import Toast from "@/components/Toast";
// import { 
//   uploadLeaseAsync,
//   getallUserLeasesAsync,
//   getUserLeasesAsync,
//   getClauseDetailsAsync,
//   getLeaseDetailsById 
// } from "@/services/lease/asyncThunk";

// export const leaseSlice = createSlice({
//   name: "lease",
//   initialState: {
//     isLoading: false,
//     submitSuccess: false,
//     updateSuccess: false,
//     deleteSuccess: false,
//     leaseError: "",
//     currentLease: {
//       userId: "",
//       name: "",
//       docType: "application/pdf",
//       url: "",
//       lease_title: "",
//       startDate: null,
//       endDate: null,
//       property_address: "",
//       notes: "",
//       type: "lease",
//       status: "",
//       action: "",
//       risk: "",
//       comments: "",
//       clauses: {},
//     },
//     leaseList: [],
//     metaData: {},
//     filters: {},
//     loadMore: false,
//   },
//   reducers: {
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action) => {
//       state.leaseError = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     // Upload lease
//     builder
//       .addCase(uploadLeaseAsync.pending, (state) => {
//         state.isLoading = true;
//         state.leaseError = "";
//       })
//       .addCase(uploadLeaseAsync.fulfilled, (state) => {
//         state.isLoading = false;
//         state.submitSuccess = true;
//         Toast.fire({ icon: "success", title: "Lease uploaded successfully!" });
//       })
//       .addCase(uploadLeaseAsync.rejected, (state, action) => {
//         state.isLoading = false;
//         state.leaseError = action.payload as string;
//         Toast.fire({ icon: "error", title: action.payload as string });
//       });

//     // Get paginated user leases (/clause/get_user_leases)
//     builder
//       .addCase(getUserLeasesAsync.pending, (state) => {
//         state.isLoading = true;
//         state.leaseError = "";
//       })
//       .addCase(getUserLeasesAsync.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.leaseList = action.payload?.leases ?? action.payload;
//         state.metaData = action.payload?.meta ?? {};
//       })
//       .addCase(getUserLeasesAsync.rejected, (state, action) => {
//         state.isLoading = false;
//         state.leaseError = action.payload as string;
//       });

//     // Get all user leases (if you have a separate API)
//     builder
//       .addCase(getallUserLeasesAsync.pending, (state) => {
//         state.isLoading = true;
//         state.leaseError = "";
//       })
//       .addCase(getallUserLeasesAsync.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.leaseList = action.payload;
//       })
//       .addCase(getallUserLeasesAsync.rejected, (state, action) => {
//         state.isLoading = false;
//         state.leaseError = action.payload as string;
//       });

//     // Clause details
//     builder
//       .addCase(getClauseDetailsAsync.pending, (state) => {
//         state.isLoading = true;
//         state.leaseError = "";
//       })
//       .addCase(getClauseDetailsAsync.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentLease = action.payload;
//       })
//       .addCase(getClauseDetailsAsync.rejected, (state, action) => {
//         state.isLoading = false;
//         state.leaseError = action.payload as string;
//       });

//     // Lease details by ID
//     builder
//       .addCase(getLeaseDetailsById.pending, (state) => {
//         state.isLoading = true;
//         state.leaseError = "";
//       })
//       .addCase(getLeaseDetailsById.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.currentLease = action.payload;
//       })
//       .addCase(getLeaseDetailsById.rejected, (state, action) => {
//         state.isLoading = false;
//         state.leaseError = action.payload as string;
//       });
//   },
// });

// export const { setLoading, setError } = leaseSlice.actions;

// export const selectLease = (state: any) => state.lease;

// export default leaseSlice.reducer;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  uploadLeaseAsync,
  getallUserLeasesAsync,
  getUserLeasesAsync,
  getClauseDetailsAsync,
  getLeaseDetailsById,
} from "@/services/lease/asyncThunk";
import Toast from "@/components/Toast";

// ---- Types (adjust fields to match your API) ----
type LeaseItem = {
  lease_id: string | number;
  lease_title: string;
};

type LeaseList = {
  data: LeaseItem[];
  meta?: Record<string, any>;
};

type CurrentLease = Record<string, any>; // replace with your real type

type LeaseState = {
  isLoading: boolean;
  submitSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  leaseError: string;
  currentLease: CurrentLease;
  leaseList: LeaseList;         // << stable shape with .data
  metaData: Record<string, any>;
  filters: Record<string, any>;
  loadMore: boolean;
};

// ---- Initial State ----
const initialState: LeaseState = {
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
  leaseList: { data: [] },      // << important: not []
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
        state.leaseError = (action.payload as string) ?? "Upload failed";
        Toast.fire({ icon: "error", title: state.leaseError });
      });

    // Get paginated user leases
    builder
      .addCase(getUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        // Normalize payload so leaseList always has { data: LeaseItem[] }
        const payload = action.payload as any;
        // Supports either { leases: [...] } | { data: [...] } | [...]
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
      });

    // Get all user leases
    builder
      .addCase(getallUserLeasesAsync.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getallUserLeasesAsync.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload as any;
        const data: LeaseItem[] = Array.isArray(payload)
          ? payload
          : payload?.leases ?? payload?.data ?? [];
        const meta = payload?.meta ?? {};

        state.leaseList = { data, meta };
      })
      .addCase(getallUserLeasesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = (action.payload as string) ?? "Failed to fetch leases";
      });

    // Clause details
    builder
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
      });

    // Lease details by ID
    builder
      .addCase(getLeaseDetailsById.pending, (state) => {
        state.isLoading = true;
        state.leaseError = "";
      })
      .addCase(getLeaseDetailsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaseError = "";
        state.currentLease = action.payload as CurrentLease;
      })
      .addCase(getLeaseDetailsById.rejected, (state, action) => {
        state.isLoading = false;
        state.leaseError = (action.payload as string) ?? "Failed to fetch lease";
      });
  },
});

export const { setLoading, setError } = leaseSlice.actions;
export const selectLease = (state: any) => state.lease;
export default leaseSlice.reducer;

