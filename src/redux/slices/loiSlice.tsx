/* eslint-disable @typescript-eslint/no-explicit-any */
import Toast from "@/components/Toast";
import {
  submitLOIAsync,
  getLOIDetailsById,
  getDraftLOIsAsync,
  runAiAssistantAsync,
  submitLOIByFileAsync,
  deleteLOIAsync,

  llReadClauseAsync,
  llApproveAllAsync,
  llRejectAllAsync,
  llCommentClauseAsync,
  llDecideClauseAsync,
  getAllLandlordLOIsAsync,
  rejectLoillApi,
  approveLoillApi,
  submitLOIByFileAsyncNoId,
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
    landlord: {
      readingClause: false,
      activeClauseKey: null as string | null,
      clauseMap: {} as Record<string, { text?: string; risk?: string; status?: string; warning?: string; comments?: Array<{ text: string; by?: string; at?: string }> }>,
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
      .addCase(submitLOIAsync.pending, (state: any) => {
        state.isLoading = true;
        state.loiError = "";
      })
      .addCase(submitLOIAsync.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.submitSuccess = true;

        const payload = action.payload;

        if (payload?.data) {
          if (Array.isArray(state.loiList)) {
            state.loiList.unshift(payload.data);

          } else if (state.loiList && Array.isArray(state.loiList.data)) {
            state.loiList.data.unshift(payload.data);
            if (typeof state.loiList.total === "number") {
              state.loiList.total += 1;
            }

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
        state.currentLOI = action.payload;
        console.log("action.payload", action.payload)
      })
      .addCase(getLOIDetailsById.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(runAiAssistantAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(runAiAssistantAsync.fulfilled, (state) => {
        state.isLoading = false;
        Toast.fire({ icon: "success", title: "Assistant suggestions applied" });
      })
      .addCase(runAiAssistantAsync.rejected, (state, action) => {
        state.isLoading = false;
        Toast.fire({ icon: "error", title: action.payload || "Assistant failed" });
      })

      // 2) Handlers
      .addCase(submitLOIByFileAsync.pending, (state) => {
        state.isLoading = true;
        state.loiError = "";
        state.submitByFileResult = null;
      })
      .addCase(submitLOIByFileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submitSuccess = true;

        const data = (action as any)?.payload?.data as unknown;

        let id: string | undefined;
        if (typeof data === "string") {
          id = data;
        } else if (data && typeof data === "object" && "doc_id" in (data as Record<string, unknown>)) {
          const maybe = (data as { doc_id?: unknown }).doc_id;
          if (typeof maybe === "string") id = maybe;
        }

        if (id) {
          state.submitByFileResult = { doc_id: id };
        }

        Toast.fire({ icon: "success", title: "LOI File Submitted Successfully" });
      })
      .addCase(submitLOIByFileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      })

       .addCase(submitLOIByFileAsyncNoId.pending, (state) => {
        state.isLoading = true;
        state.loiError = "";
        state.submitByFileResult = null;
      })
      .addCase(submitLOIByFileAsyncNoId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submitSuccess = true;

        const data = (action as any)?.payload?.data as unknown;

        let id: string | undefined;
        if (typeof data === "string") {
          id = data;
        } else if (data && typeof data === "object" && "doc_id" in (data as Record<string, unknown>)) {
          const maybe = (data as { doc_id?: unknown }).doc_id;
          if (typeof maybe === "string") id = maybe;
        }

        if (id) {
          state.submitByFileResult = { doc_id: id };
        }

        Toast.fire({ icon: "success", title: "LOI File Submitted Successfully" });
      })
      .addCase(submitLOIByFileAsyncNoId.rejected, (state, action) => {
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
        if (id && state.loiList?.my_loi) {
          state.loiList.my_loi = state.loiList.my_loi.filter((r: any) => r.id !== id);
        }
        Toast.fire({ icon: "success", title: "LOI deleted" });
      })
      .addCase(deleteLOIAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      })
      // landlord read clause

      .addCase(getAllLandlordLOIsAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllLandlordLOIsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loiList = action.payload;
      })
      .addCase(getAllLandlordLOIsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.loiError = action.payload as string;
      })

      .addCase(llReadClauseAsync.pending, (state, action) => {
        state.landlord.readingClause = true;
        state.landlord.activeClauseKey = (action.meta.arg as any).clause_key;
      })
      .addCase(llReadClauseAsync.fulfilled, (state, action) => {
        state.landlord.readingClause = false;
        const key = (action.payload as any)?.clause_key;
        if (key) state.landlord.clauseMap[key] = (action.payload as any).data;
      })
      .addCase(llReadClauseAsync.rejected, (state, action) => {
        state.landlord.readingClause = false;
        state.loiError = (action.payload as string) || "Failed to read clause";
      })

      .addCase(llApproveAllAsync.fulfilled, (state) => {
        const clauses = (state.currentLOI as any)?.clauses;
        if (Array.isArray(clauses)) {
          clauses.forEach((c: any) => {
            const entry = state.landlord.clauseMap[c.key] || {};
            entry.status = "approved";
            state.landlord.clauseMap[c.key] = entry;
          });
        }
      })
      .addCase(llApproveAllAsync.rejected, (state, action) => {
        state.loiError = (action.payload as string) || "Approve all failed";
      })
      .addCase(llRejectAllAsync.fulfilled, (state) => {
        const clauses = (state.currentLOI as any)?.clauses;
        if (Array.isArray(clauses)) {
          clauses.forEach((c: any) => {
            const entry = state.landlord.clauseMap[c.key] || {};
            entry.status = "need-review";
            state.landlord.clauseMap[c.key] = entry;
          });
        }
      })
      .addCase(llRejectAllAsync.rejected, (state, action) => {
        state.loiError = (action.payload as string) || "Reject all failed";
      })

      .addCase(llCommentClauseAsync.fulfilled, (state, action) => {
        const key = (action.payload as any)?.clause_key;
        if (key) {
          const entry = state.landlord.clauseMap[key] || {};
          const comments = (entry.comments as any[]) || [];
          comments.push({ text: (action.payload as any).text, at: new Date().toISOString() });
          state.landlord.clauseMap[key] = { ...entry, comments };
        }
      })

      // approve/reject single
      .addCase(llDecideClauseAsync.fulfilled, (state, action) => {
        const { clause_key, action: act } = action.payload as any;
        const entry = state.landlord.clauseMap[clause_key] || {};
        entry.status = act === "approve" ? "approved" : "need-review";
        state.landlord.clauseMap[clause_key] = entry;
      })
      .addCase(llDecideClauseAsync.rejected, (state, action) => {
        state.loiError = (action.payload as string) || "Clause action failed";
      })

      .addCase(approveLoillApi.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload;
        const history = (state.currentLOI as any)?.data?.history;
        if (history && history[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "rejected",
          };
        }
        Toast.fire({ icon: "success", title: "Clause Approve" });
      })
      .addCase(approveLoillApi.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to clause approval" });
      })
      .addCase(rejectLoillApi.fulfilled, (state, action) => {
        const { clause_key, details } = action.payload;
        const history = (state.currentLOI as any)?.data?.history;
        if (history && history[clause_key]) {
          history[clause_key] = {
            ...history[clause_key],
            current_version: details,
            status: "rejected",
          };
        }
        Toast.fire({ icon: "success", title: "Clause Approve" });
      })
      .addCase(rejectLoillApi.rejected, (state, action) => {
        Toast.fire({ icon: "error", title: (action.payload as string) ?? "Failed to clause approval" });
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