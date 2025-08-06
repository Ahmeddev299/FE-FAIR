import { createAsyncThunk } from "@reduxjs/toolkit";
import { loiBaseService } from "../loi/enpoints";
import { HttpService } from "../index";
import ls from "localstorage-slim";
import { dashboardStatusService } from "./endpoint";

// in asyncThunk.ts or wherever you define thunks
export const getDashboardStatsAsync = createAsyncThunk(
  "dashboard/stats",
  async (_, { rejectWithValue }) => {
    try {
      const token = `${ls.get("access_token", { decrypt: true })}`;
      HttpService.setToken(token);  
      const response = await dashboardStatusService.dashboardStats(); // API call
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