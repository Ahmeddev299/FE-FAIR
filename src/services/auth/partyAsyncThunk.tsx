/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authBaseService } from "./endpoints";

export interface PartyItem {
  _id: string;
  name: string;
  email: string;
  [key: string]: any;
}

export const fetchLandlordsAsync = createAsyncThunk<
  any[],         // return the raw array first; we normalize in slice
  void,
  { rejectValue: string }
>("party/fetch-landlords", async (_, { rejectWithValue }) => {
  try {
    const res = await authBaseService.getAllLandlords();
    // ✔ pull out the array
    const list = res?.data?.landlords ?? [];
    return Array.isArray(list) ? list : [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message || err?.message || "Failed to load landlords";
    return rejectWithValue(msg);
  }
});

export const fetchTenantsAsync = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("party/fetch-tenants", async (_, { rejectWithValue }) => {
  try {
    const res = await authBaseService.getAllTenants();
    const list = res?.data?.tenants ?? [];
    console.log("list", list)
    return Array.isArray(list) ? list : [];
  } catch (err: any) {
    const msg =
      err?.response?.data?.message || err?.message || "Failed to load tenants";
    return rejectWithValue(msg);
  }
});
