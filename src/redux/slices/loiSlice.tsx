/* eslint-disable @typescript-eslint/no-explicit-any */
import Toast from "@/components/Toast";
import {
  submitLOIAsync,
  getLOIDetailsById,
  getDraftLOIsAsync,
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
        Toast.fire({ icon: "success", title: "LOI submitted successfully!" });
        // Optionally add the new LOI to the list
        if (action.payload.data) {
          state.loiList.unshift(action.payload.data);
        }
      })
      .addCase(submitLOIAsync.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.loiError = action.payload;
        Toast.fire({ icon: "error", title: action.payload });
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
      .addCase(getLOIDetailsById.rejected, (state, action) => {
        state.isLoading = false;

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