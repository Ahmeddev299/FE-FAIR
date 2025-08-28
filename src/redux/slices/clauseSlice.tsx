/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { getClausesByLeaseAsync, getClauseByIdAsync, updateClauseAsync } from "@/services/clause/asyncThunk";
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
      });
  },
});

export const { setClauseLoading, setClauseError, resetClauseState } = clauseSlice.actions;
export const selectClause = (state: any) => state.clause;
export default clauseSlice.reducer;
