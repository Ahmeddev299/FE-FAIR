
// src/store/slices/clauseSlice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import {
  getClausesByLeaseAsync,
  getClauseByIdAsync,
  updateClauseAsync,
} from "@/services/clause/asyncThunk";
import { commentOnClauseAsync } from "@/services/clause/asyncThunk"; 
import Toast from "@/components/Toast";

export const clauseSlice = createSlice({
  name: "clause",
  initialState: {
    isLoading: false,
    clauseError: "",
    clauseList: [] as any[],
    currentClause: {} as any,     
    updateSuccess: false,
  },
  reducers: {
    setClauseLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setClauseError: (state, action) => {
      state.clauseError = action.payload;
    },
    resetClauseState: (state) => {
      state.updateSuccess = false;
      state.clauseError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // get all clauses
      .addCase(getClausesByLeaseAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClausesByLeaseAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clauseList = action.payload;
      })
      .addCase(getClausesByLeaseAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.clauseError = action.payload as string;
      })

      // get single clause
      .addCase(getClauseByIdAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClauseByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentClause = action.payload;
      })
      .addCase(getClauseByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.clauseError = action.payload as string;
      })

      // update clause
      .addCase(updateClauseAsync.pending, (state) => {
        state.isLoading = true;
        state.updateSuccess = false;
      })
      .addCase(updateClauseAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = true;
        state.currentClause = { ...state.currentClause, ...action.payload };
      })
      .addCase(updateClauseAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.updateSuccess = false;
        state.clauseError = action.payload as string;
        Toast.fire({ icon: "error", title: action.payload as string });
      })

      .addCase(commentOnClauseAsync.fulfilled, (state, action) => {
        const { clause_key, comment } = action.payload as any;

        if ((state as any).currentClause) {
          const cc = (state as any).currentClause;
          cc.comments = Array.isArray(cc.comments) ? cc.comments : [];
          cc.comments.push(comment);
        }

        const lease = (state as any).currentLease;
        if (lease?.clauses?.length) {
          const idx = lease.clauses.findIndex((x: any) => x.name === clause_key);
          if (idx >= 0) {
            const prev = lease.clauses[idx];
            const prevComments = Array.isArray((prev as any).comments) ? (prev as any).comments : [];
            lease.clauses[idx] = {
              ...prev,
              comments: [...prevComments, comment],
              commentsUnresolved: (prev.commentsUnresolved ?? 0) + 1,
            };
          }
        }
                Toast.fire({ icon: "success", title: "Comments Added successfully!" });

      })
      .addCase(commentOnClauseAsync.rejected, (state, action) => {
        (state as any).clauseError = action.payload as string;
      });
  },
});

export const { setClauseLoading, setClauseError, resetClauseState } = clauseSlice.actions;
export const selectClause = (state: any) => state.clause;
export default clauseSlice.reducer;

