/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaseBaseService } from "./endpoint";
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import { LeaseFormValues } from "@/types/loi";

type UploadLeaseResponse = {
  Lease: { _id: string; name: string; lease_title: string; startDate?: string; endDate?: string; property_address?: string; };
  Clauses: { _id: string; history: Record<string, ClauseEntry>; };
};

type ClauseEntry = {
  status: string;
  clause_details: string;
  current_version: string;
  ai_suggested_clause_details: string;
  risk: string;
  comment: any[];
  created_at: string;
  updated_at: string;
};

export type UpdateClauseArgs = {
  clauseId: string;
  clause_key: string;
  details: string;
};

export type AcceptSuggestionArgs = {
  clauseId: string;
  clause_key: string;
  details: string;
};

export const uploadLeaseAsync = createAsyncThunk<UploadLeaseResponse, FormData>(
  '/lease/submitDetails',
  async (formData, { rejectWithValue }) => {
    console.log("formData", formData)
    try {
      const token = `${ls.get('access_token', { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await leaseBaseService.submitLease(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response?.success === false && response?.status === 400) {
        return rejectWithValue(response.message as any);
      }
      return (response?.data ?? response) as UploadLeaseResponse;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Upload failed' as any);
    }
  }
);

export const getUserLeasesAsync = createAsyncThunk(
  "user/lease",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      console.log("async running");
      HttpService.setToken(token);

      const response = await leaseBaseService.userleasedetails(); // API call
      if (response?.success || response?.status === 200) {
        Toast.fire({ icon: "success", title: response.message as string });
      }
      console.log("response", response)
      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch drafts");
    }
  }
);

export const getClauseDetailsAsync = createAsyncThunk(
  'lease/getClauseDetails',
  async (
    { leaseId, clauseDocId }: { leaseId: string; clauseDocId: string },
    { rejectWithValue }
  ) => {
    try {
      const token = `${ls.get('access_token', { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("running")
      const response = await leaseBaseService.getClauseDetails(leaseId, clauseDocId);
      console.log("response", response)

      if (!response?.success || response?.status === 400) {
        return rejectWithValue(response?.message ?? 'Failed to fetch clause details');
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch clause details');
    }
  }
);

export const terminateLeaseAsync = createAsyncThunk(
  "lease/terminate",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`
      HttpService.setToken(token);
      const response = await leaseBaseService.terminatelease(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success === false && response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;

    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.response?.message) {
        return rejectWithValue(error.response.message);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unexpected error occurred while submitting LOI');
      }
    }
  }
)

export const getLeaseDetailsById = createAsyncThunk(
  "lease/fetchSingleDraft",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await leaseBaseService.getSingleLeaseDetail(leaseId);
      console.log("response 140", response);

      // Only reject if it actually failed
      if (response.status !== 200 || !response.success) {
        return rejectWithValue(response.message || "Failed to fetch lease");
      }

      // return the lease object
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch lease");
    }
  }
);

export const deleteLeaseAsync = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>("lease/delete", async (leaseId, { rejectWithValue }) => {
  try {
    const token: string = `${ls.get("access_token", { decrypt: true })}`;
    HttpService.setToken(token);
    const response = await leaseBaseService.deleteLease(leaseId);

    if (response?.success === false) {
      return rejectWithValue(response?.message || "Failed to delete LOI");
    }
    return { id: leaseId };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.message ||
      err?.message ||
      "Delete failed";
    return rejectWithValue(msg);
  }
});

export const submitLeaseAsync = createAsyncThunk(
  "lease/submitLease",
  async (payload: LeaseFormValues, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await leaseBaseService.createLease(payload);

      if (!response || response.success === false || response.status === 400) {
        return rejectWithValue(response?.message ?? "Lease submission failed");
      }
      return response.data ?? response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || "Lease submission failed");
    }
  }
);

export const getallUserLeasesAsync = createAsyncThunk(
  "lease/listForClauses",
  async ({ page = 1, limit = 5 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await leaseBaseService.getUserLeases({ page, limit });

      if (!response?.success || response?.status === 400) {
        return rejectWithValue(response?.message ?? "Failed to fetch leases");
      }

      return response.data; // expect { leases: [...], page, limit, total } or similar
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch leases");
    }
  }
);

/** ---------- Manual Edit (Save current version) ---------- */
export const updateClauseCurrentVersionAsync = createAsyncThunk(
  "lease/updateClauseCurrentVersion",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await leaseBaseService.updateClauseDetailOrCurrentVersion(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "manual_edit",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }

      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);

/** ---------- Manual Edit (Save current version) ---------- */
export const updateLandlordClauseCurrentVersionAsync = createAsyncThunk(
  "lease/updateLandlordClauseCurrentVersion",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await leaseBaseService.updateLandlordClauseDetailOrCurrentVersion(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "manual_edit",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }

      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);



export const approveLoiClauseApi = createAsyncThunk(
  "loi/update",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await leaseBaseService.approveLOIclause(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "approved",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }
      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);

export const rejectLoiClauseApi = createAsyncThunk(
  "loi/reject",
  async ({ clauseId, clause_key, details }: UpdateClauseArgs, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      console.log("clauseid", clauseId)
      const res = await leaseBaseService.rejectLOIclause(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "rejected",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to save clause");
      }
      return { clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to save clause");
    }
  }
);

export const acceptClauseSuggestionAsync = createAsyncThunk<
  { clauseId: string; clause_key: string; details: string },
  AcceptSuggestionArgs
>(
  "lease/acceptClauseSuggestion",
  async ({ clauseId, clause_key, details }, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const res = await leaseBaseService.updateClauseDetailOrCurrentVersion(clauseId, {
        clause_id: clauseId,
        clause_key,
        details,
        action: "accept_ai_suggestion",
      });

      if (!res?.success || res?.status === 400) {
        return rejectWithValue(res?.message ?? "Failed to accept AI suggestion");
      }
      return { clauseId, clause_key, details };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to accept AI suggestion");
    }
  }
);