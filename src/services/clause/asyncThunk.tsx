/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clauseBaseService } from "./endpoints";
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";

// Approve / Reject / Edit Clause
export const updateClauseAsync = createAsyncThunk(
  "clause/update",
  async (
    { leaseId, clauseId, action, payload }: { leaseId: string; clauseId: string; action: "approve" | "reject" | "edit"; payload?: any },
    { rejectWithValue }
  ) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await clauseBaseService.updateClause(leaseId, clauseId, { action, ...payload });

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      Toast.fire({ icon: "success", title: "Clause updated successfully" });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to update clause");
    }
  }
);

// Fetch clauses of a lease
export const getClausesByLeaseAsync = createAsyncThunk(
  "clause/list",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await clauseBaseService.getClausesByLease(leaseId);

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch clauses");
    }
  }
);

// Fetch single clause details
export const getClauseByIdAsync = createAsyncThunk(
  "clause/detail",
  async ({ leaseId, clauseId }: { leaseId: string; clauseId: string }, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await clauseBaseService.getClauseById(leaseId, clauseId);

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch clause details");
    }
  }
);
