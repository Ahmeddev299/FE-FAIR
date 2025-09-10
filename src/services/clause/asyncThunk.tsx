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

export const commentOnClauseAsync = createAsyncThunk(
  "clause/commentOnClause",
  async (
    params: {
      clauseDocId: string;        // e.g., "68b83db750cf251edaaee326"
      clause_key: string;         // clause title/key
      comment: string;            // comment text/body
    },
    { rejectWithValue }
  ) => {
    try {
      const { clauseDocId, clause_key, comment } = params;

      // API endpoint (typo preserved as provided)
      const url = `https://api.fairleases.com/clause/comment_on_signle_clauses_of_single_lease/${clauseDocId}`;

      const res = await fetch(url, {
        method: "PUT", // adjust to your server (POST/PUT/PATCH)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clause_id: clauseDocId,           // keeping prior naming style you used elsewhere
          clause_title: clause_key,
          comment: comment,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to add comment");
      }

      const data = await res.json();
      // Expected to return the new/updated comment or clause block
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to add comment");
    }
  }
);