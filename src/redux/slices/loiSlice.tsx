/* eslint-disable @typescript-eslint/no-explicit-any */
import Toast from "@/components/Toast";
import {
  submitLOIAsync,
  getLOIDetailsById,
  getDraftLOIsAsync,
  runAiAssistantAsync,
  submitLOIByFileAsync,
  deleteLOIAsync,
} from "@/services/loi/asyncThunk";
import { createSlice } from "@reduxjs/toolkit";
export type LOIStatus = 'Draft' | 'Sent' | 'Approved';

export const loiSlice = createSlice({
  name: "loi",
  initialState: {
    isLoading: false,
    submitSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    loiError: "",
    currentLOI: {
      title: "",
      propertyAddress: "",
      partyInfo: {
        landlord_name: "",
        landlord_email: "",
        tenant_name: "",
        tenant_email: "",
      },
      leaseTerms: {
        monthlyRent: "",
        securityDeposit: "",
        leaseType: "",
        leaseDuration: "",
        startDate: null,
      },
      propertyDetails: {
        propertySize: "",
        intendedUse: "",
        propertyType: "",
        amenities: [],
        utilities: [],
      },
      additionalDetails: {
        renewalOption: false,
        tenantImprovement: "",
        specialConditions: "",
        contingencies: "",
      },
      submit_status: "Draft",
    },
    loiList: {
      my_loi: [],
    },
    submitByFileResult: null as { doc_id: string } | null,

    metaData: {},
    filters: {},
    loadMore: false,
  },
  reducers: {
    setCurrentLOI: (state: any, action: any) => {
      state.currentLOI = action.payload;
    },

    updateLOIField: (state: any, action: any) => {
      const { field, value } = action.payload;
      const fieldPath = field.split('.');

      if (fieldPath.length === 1) {
        state.currentLOI[field] = value;
      } else if (fieldPath.length === 2) {
        state.currentLOI[fieldPath[0]][fieldPath[1]] = value;
      }
    },

    setPartyInfo: (state: any, action: any) => {
      state.currentLOI.partyInfo = { ...state.currentLOI.partyInfo, ...action.payload };
    },

    setLeaseTerms: (state: any, action: any) => {
      state.currentLOI.leaseTerms = { ...state.currentLOI.leaseTerms, ...action.payload };
    },

    setPropertyDetails: (state: any, action: any) => {
      state.currentLOI.propertyDetails = { ...state.currentLOI.propertyDetails, ...action.payload };
    },

    setAdditionalDetails: (state: any, action: any) => {
      state.currentLOI.additionalDetails = { ...state.currentLOI.additionalDetails, ...action.payload };
    },

    addAmenity: (state: any, action: any) => {
      state.currentLOI.propertyDetails.amenities.push(action.payload);
    },

    removeAmenity: (state: any, action: any) => {
      state.currentLOI.propertyDetails.amenities = state.currentLOI.propertyDetails.amenities.filter(
        (amenity: string, index: number) => index !== action.payload
      );
    },

    addUtility: (state: any, action: any) => {
      state.currentLOI.propertyDetails.utilities.push(action.payload);
    },

    removeUtility: (state: any, action: any) => {
      state.currentLOI.propertyDetails.utilities = state.currentLOI.propertyDetails.utilities.filter(
        (utility: string, index: number) => index !== action.payload
      );
    },

    setSubmitStatus: (state: any, action: any) => {
      state.currentLOI.submit_status = action.payload;
    },

    resetCurrentLOI: (state: any) => {
      state.currentLOI = {
        title: "",
        propertyAddress: "",
        partyInfo: {
          landlord_name: "",
          landlord_email: "",
          tenant_name: "",
          tenant_email: "",
        },
        leaseTerms: {
          monthlyRent: "",
          securityDeposit: "",
          leaseType: "",
          leaseDuration: "",
          startDate: null,
        },
        propertyDetails: {
          propertySize: "",
          intendedUse: "",
          propertyType: "",
          amenities: [],
          utilities: [],
        },
        additionalDetails: {
          renewalOption: false,
          tenantImprovement: "",
          specialConditions: "",
          contingencies: "",
        },
        submit_status: "Draft",
      };
    },

    setSubmitSuccess: (state: any, action: any) => {
      state.submitSuccess = action.payload;
    },

    setUpdateSuccess: (state: any, action: any) => {
      state.updateSuccess = action.payload;
    },

    setDeleteSuccess: (state: any, action: any) => {
      state.deleteSuccess = action.payload;
    },

    setLoading: (state: any, action: any) => {
      state.isLoading = action.payload;
    },

    setError: (state: any, action: any) => {
      state.loiError = action.payload;
    },

    setMetaData: (state: any, action: any) => {
      state.metaData = action.payload;
    },

    setFilters: (state: any, action: any) => {
      state.filters = action.payload;
    },

    setLoadMore: (state: any, action: any) => {
      state.loadMore = action.payload;
    },

    setLOIList: (state: any, action: any) => {
      state.loiList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit LOI
      .addCase(submitLOIAsync.pending, (state: any) => {
        state.isLoading = true;
        state.loiError = "";
      })
      .addCase(submitLOIAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.submitSuccess = true;

        const payload = action.payload; // { status, message, success, data }

        if (payload?.data) {
          // Case A: loiList is an array
          if (Array.isArray(state.loiList)) {
            state.loiList.unshift(payload.data);

            // Case B: loiList is a paginated object like { data: [], total: ... }
          } else if (state.loiList && Array.isArray(state.loiList.data)) {
            state.loiList.data.unshift(payload.data);
            if (typeof state.loiList.total === "number") {
              state.loiList.total += 1;
            }

            // Case C: loiList was missing – initialize as array
          } else {
            state.loiList = [payload.data];
          }
        }

        Toast.fire({
          icon: "success",
          title: payload?.message || "LOI Submitted Successfully",
        });
      })
      .addCase(submitLOIAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.loiError = action.payload || action.error?.message || "Submission failed";
        Toast.fire({ icon: "error", title: state.loiError });
      })
      
      .addCase(getDraftLOIsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDraftLOIsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loiList = action.payload;
      })
      .addCase(getDraftLOIsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
      })
      .addCase(getLOIDetailsById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLOIDetailsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLOI = action.payload; // ✅ Prefill redux state with fetched LOI
        console.log("action.payload", action.payload)
      })
      .addCase(getLOIDetailsById.rejected, (state) => {
        state.isLoading = false;
      })

      // store/loiSlice.ts (extraReducers additions)
      .addCase(runAiAssistantAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(runAiAssistantAsync.fulfilled, (state) => {
        state.isLoading = false;
        Toast.fire({ icon: "success", title: "Assistant suggestions applied" });
        // If backend returns updated LOI, you could merge it here:
        // state.currentLOI = { ...state.currentLOI, ...action.payload };
      })
      .addCase(runAiAssistantAsync.rejected, (state, action) => {
        state.isLoading = false;
        Toast.fire({ icon: "error", title: action.payload || "Assistant failed" });
      })

      // 2) Handlers
      .addCase(submitLOIByFileAsync.pending, (state) => {
        state.isLoading = true;
        state.loiError = "";
        state.submitByFileResult = null; // optional: clear previous
      })
      .addCase(submitLOIByFileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submitSuccess = true;

        // Safely normalize the payload without accessing .doc_id on a mismatched type
        const data = (action as any)?.payload?.data as unknown;

        let id: string | undefined;
        if (typeof data === "string") {
          id = data;
        } else if (data && typeof data === "object" && "doc_id" in (data as Record<string, unknown>)) {
          const maybe = (data as { doc_id?: unknown }).doc_id;
          if (typeof maybe === "string") id = maybe;
        }

        if (id) {
          state.submitByFileResult = { doc_id: id }; // store separately
        }

        Toast.fire({ icon: "success", title: "LOI File Submitted Successfully" });
      })
      .addCase(submitLOIByFileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      })
      .addCase(deleteLOIAsync.pending, (state) => {
        state.isLoading = true;
        state.loiError = "";
      })
      .addCase(deleteLOIAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteSuccess = true;

        const id = action.payload?.id;
        console.log("id", id)
        // Remove from list if it's in the dashboard summary shape
        if (id && state.loiList?.my_loi) {
          state.loiList.my_loi = state.loiList.my_loi.filter((r: any) => r.id !== id);
        }
        Toast.fire({ icon: "success", title: "LOI deleted" });
      })
      .addCase(deleteLOIAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      });
  },
});

export const {
  setCurrentLOI,
  updateLOIField,
  setPartyInfo,
  setLeaseTerms,
  setPropertyDetails,
  setAdditionalDetails,
  addAmenity,
  removeAmenity,
  addUtility,
  removeUtility,
  setSubmitStatus,
  resetCurrentLOI,
  setSubmitSuccess,
  setUpdateSuccess,
  setDeleteSuccess,
  setLoading,
  setError,
  setMetaData,
  setFilters,
  setLoadMore,
  setLOIList,
} = loiSlice.actions;

export const selectLOI = (state: any) => state.loi;

export default loiSlice.reducer;