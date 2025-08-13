/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaseBaseService } from "./endpoint";
import type { LOIApiPayload } from "@/types/loi"; // adjust path accordingly
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";

// types (optional but nice)

type UploadLeaseResponse = {
  Lease: { _id: string; name: string; lease_title: string; startDate?: string; endDate?: string; property_address?: string; };
  Clauses: { _id: string; history: Record<string, ClauseEntry>; };
};

type GetClauseDetailsArgs = { leaseId: string; clauseDocId?: string };

// Optional typing based on your API sample
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
type GetClauseDetailsResponse = {
  Lease: {
    _id: string;
    name: string;
    lease_title: string;
    startDate?: string;
    endDate?: string;
    property_address?: string;
  };
  Clauses: {
    _id: string;
    history: Record<string, ClauseEntry>;
  };
};

export const uploadLeaseAsync = createAsyncThunk<UploadLeaseResponse, FormData>(
  '/loi/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const token = `${ls.get('access_token', { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await leaseBaseService.submitLease(formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response?.success === false && response?.status === 400) {
        return rejectWithValue(response.message as any);
      }
      return (response.data ?? response) as UploadLeaseResponse;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Upload failed' as any);
    }
  }
);


// in asyncThunk.ts or wherever you define thunks
export const getUserLeasesAsync = createAsyncThunk(
  "user/lease",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      console.log("async runnig"),
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
      // Additional check for API-level errors
      if (response.success === false && response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;

    } catch (error: any) {
      // Handle different error scenarios
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

// in asyncThunk.ts or wherever you define thunks
export const getLeaseDetailsById = createAsyncThunk(
  "lease/fetchSingleDraft",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      // Assuming your API accepts leaseId as a query param
      const response = await leaseBaseService.getSingleLeaseDetail(leaseId);

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
