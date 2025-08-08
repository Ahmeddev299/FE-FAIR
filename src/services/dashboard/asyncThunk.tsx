import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardStatusService } from "./endpoint";
import ls from "localstorage-slim";

// Updated thunk that works with the new HTTP service
export const getDashboardStatsAsync = createAsyncThunk(
  "dashboard/stats",
  async (_, { rejectWithValue }) => {
    try {
      // No need to manually set token - it's handled by interceptors now
      const token = ls.get("access_token", { decrypt: true });
      
      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await dashboardStatusService.dashboardStats();
      
      console.log("Dashboard stats response:", response);

      // The HTTP service now handles most error cases automatically
      // But you can still add custom business logic validation here
      if (!response) {
        return rejectWithValue("No data received from server");
      }

      // If your API returns a wrapper object with success/data properties
      if (response.success === false) {
        return rejectWithValue(response.message || "Request failed");
      }

      return response.data || response;
    } catch (error: any) {
      console.error("Dashboard stats error:", error);
      
      // The enhanced HTTP service provides better error information
      if (error.code === 'NETWORK_ERROR') {
        return rejectWithValue("Network error. Please check your connection.");
      }
      
      if (error.status === 401) {
        return rejectWithValue("Session expired. Please log in again.");
      }
      
      if (error.status === 403) {
        return rejectWithValue("You don't have permission to access this resource.");
      }
      
      if (error.status === 404) {
        return rejectWithValue("Dashboard statistics not found.");
      }
      
      if (error.status >= 500) {
        return rejectWithValue("Server error. Please try again later.");
      }
      
      return rejectWithValue(
        error.message || "Failed to fetch dashboard statistics"
      );
    }
  }
);

// Example of how to use the cancel functionality
export const cancelDashboardStatsRequest = () => {
  // You can import httpService and use it to cancel specific requests
  // httpService.cancel('GET-dashboard/stats');
};