// src/services/dashboard/asyncThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardStatusService } from "./endpoint";
import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import type { DashboardData, LoiSummary } from "@/redux/slices/dashboardSlice";

/** Small helpers */
type RejectString = { rejectValue: string };
type UnknownRecord = Record<string, unknown>;

const isObject = (v: unknown): v is UnknownRecord =>
  typeof v === "object" && v !== null;

const getErrorMessage = (err: unknown): string => {
  if (!err) return "Unexpected error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  try {
    if (isObject(err)) {
      const response = isObject(err.response) ? (err.response as UnknownRecord) : undefined;
      const data = response && isObject(response.data) ? (response.data as UnknownRecord) : undefined;
      const msgFromData = data?.message;
      if (typeof msgFromData === "string") return msgFromData;

      const msg = err.message;
      if (typeof msg === "string") return msg;
    }
  } catch {
    /* noop */
  }
  return "An error occurred";
};

const getStatus = (err: unknown): number | undefined => {
  if (!isObject(err)) return undefined;

  const direct = err.status;
  if (typeof direct === "number") return direct;

  const response = isObject(err.response) ? (err.response as UnknownRecord) : undefined;
  const nested = response?.status;
  return typeof nested === "number" ? nested : undefined;
};

const getCode = (err: unknown): string | undefined => {
  if (!isObject(err)) return undefined;
  const code = err.code;
  return typeof code === "string" ? code : undefined;
};

export const getDashboardStatsAsync = createAsyncThunk<
  DashboardData, // return type
  void,          // arg type
  RejectString   // thunkApi config
>(
  "dashboard/stats",
  async (_, { rejectWithValue }) => {
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) return rejectWithValue("Authentication token not found");

      const response: unknown = await dashboardStatusService.dashboardStats();

      // best-effort runtime check
      const resp = response as
        | {
            success?: boolean;
            status?: number;
            message?: string;
            detail?: string;
            data?: DashboardData;
          }
        | undefined;

      if (resp?.success || resp?.status === 200) {
        if (resp?.message) Toast.fire({ icon: "success", title: resp.message });
      }

      if (!resp) return rejectWithValue("No data received from server");
      if (resp.success === false) {
        return rejectWithValue(resp.detail || "Request failed");
      }

      return resp.data ?? (response as DashboardData);
    } catch (error: unknown) {
      const status = getStatus(error);
      if (status === 401) return rejectWithValue("Session expired. Please log in again.");
      if (status === 403) return rejectWithValue("You don't have permission to access this resource.");
      if (status === 404) return rejectWithValue("Dashboard statistics not found.");
      if (typeof status === "number" && status >= 500) {
        return rejectWithValue("Server error. Please try again later.");
      }
      if (getCode(error) === "NETWORK_ERROR") {
        return rejectWithValue("Network error. Please check your connection.");
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getloiDataAsync = createAsyncThunk<
  { my_loi?: LoiSummary[] } | LoiSummary[], // return type supports both shapes
  void,
  RejectString
>(
  "dashboard/alllois",
  async (_, { rejectWithValue }) => {
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) return rejectWithValue("Authentication token not found");

      const response: unknown = await dashboardStatusService.getloiData();
      const resp = response as
        | {
            success?: boolean;
            status?: number;
            message?: string;
            data?: { my_loi?: LoiSummary[] } | LoiSummary[];
          }
        | undefined;

      if (resp?.success || resp?.status === 200) {
        if (resp?.message) Toast.fire({ icon: "success", title: resp.message });
      }

      if (!resp) return rejectWithValue("No data received from server");
      if (resp.success === false) {
        return rejectWithValue("Request failed");
      }

      return resp.data ?? (response as { my_loi?: LoiSummary[] } | LoiSummary[]);
    } catch (error: unknown) {
      const status = getStatus(error);
      if (status === 401) return rejectWithValue("Session expired. Please log in again.");
      if (status === 403) return rejectWithValue("You don't have permission to access this resource.");
      if (status === 404) return rejectWithValue("LOI data not found.");
      if (typeof status === "number" && status >= 500) {
        return rejectWithValue("Server error. Please try again later.");
      }
      if (getCode(error) === "NETWORK_ERROR") {
        return rejectWithValue("Network error. Please check your connection.");
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
