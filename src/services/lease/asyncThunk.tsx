/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { leaseBaseService } from "./endpoint";
import type { LOIApiPayload } from "@/types/loi"; // adjust path accordingly
import { HttpService } from "../index";
import ls from "localstorage-slim";

export const uploadLeaseAsync = createAsyncThunk(
  "/loi/submit",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token: string = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await leaseBaseService.submitLease(formData, {
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
);

// in asyncThunk.ts or wherever you define thunks
export const getUserLeasesAsync = createAsyncThunk(
  "user/lease",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);
      const response = await leaseBaseService.userleasedetails(); // API call
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