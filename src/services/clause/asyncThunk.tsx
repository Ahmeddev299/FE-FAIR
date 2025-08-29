/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clauseBaseService } from "./endpoints";
import { HttpService } from "../index";
import ls from "localstorage-slim";

// Approve / Reject / Edit Clause
export type UpdateClauseTag = "approved" | "reject";

export const updateClauseAsync = createAsyncThunk<
  { leaseId: string; clauseKey: string; tag: UpdateClauseTag; server?: any },
  { leaseId: string; clauseKey: string; tag: UpdateClauseTag | "approve" | "rejected" },
  { rejectValue: string }
>(
  "clause/update",
  async ({ leaseId, clauseKey, tag }, { rejectWithValue }) => {
    // normalize frontend variants → API’s expected set
    const normalizedTag: UpdateClauseTag =
      tag === "approve" ? "approved" :
        tag === "rejected" ? "reject" :
          (tag as UpdateClauseTag);

    // basic guards
    if (!leaseId) return rejectWithValue("Lease id is missing");
    if (!clauseKey) return rejectWithValue("Clause key (name) is required");
    if (!["approved", "reject"].includes(normalizedTag))
      return rejectWithValue("Invalid tag. Use 'approved' or 'reject'.");

    try {
      const res = await clauseBaseService.updateClauseStatus(leaseId, {
        clause_key: clauseKey,
        tag: normalizedTag,
      });

      // handle common API shapes
      const success =
        res?.success === true ||
        res?.status === 200 ||
        res?.ok === true ||
        res?.message?.toLowerCase?.().includes("updated") ||
        !!res?.data;

      if (!success) {
        const msg =
          res?.message ||
          res?.error ||
          "Failed to update clause status on the server.";
        return rejectWithValue(msg);
      }

      return { leaseId, clauseKey, tag: normalizedTag, server: res };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Network error while updating clause.";
      return rejectWithValue(msg);
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
