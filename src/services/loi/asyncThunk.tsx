/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loiBaseService } from "./enpoints";
import type { LOIApiPayload } from "@/types/loi"; // adjust path accordingly
import { HttpService } from "../index";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";

export const submitLOIAsync = createAsyncThunk(
  "/loi/submit",
  async (data: LOIApiPayload, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await loiBaseService.submitLOI(data);

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
);
// in asyncThunk.ts or wherever you define thunks
export const getDraftLOIsAsync = createAsyncThunk(
  "loi/fetchDrafts",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await loiBaseService.draftLOI(); // API call

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch drafts");
    }
  }
);

// in asyncThunk.ts or wherever you define thunks
export const getLOIDetailsById = createAsyncThunk(
  "loi/fetchSingleDraft",
  async (loiId: string, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);

      const response = await loiBaseService.singledraftLOI(loiId);

      if (response.success || response.status === 200) {
        Toast.fire({ icon: "success", title: response.message as string });
      }

      if (!response.success || response.status === 400) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response);
    }
  }
);

