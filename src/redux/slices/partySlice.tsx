/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
import Toast from "@/components/Toast";

interface PartyState {
  landlords: { _id: string; name: string; email: string }[];
  tenants: { _id: string; name: string; email: string }[];
  loadingLandlords: boolean;
  loadingTenants: boolean;
  errorLandlords: string | null;
  errorTenants: string | null;
}

const initialState: PartyState = {
  landlords: [],
  tenants: [],
  loadingLandlords: false,
  loadingTenants: false,
  errorLandlords: null,
  errorTenants: null,
};

const normalize = (x: any) => ({
  _id: x._id ?? x.id ?? "",
  name:
    x.name ??
    x.fullName ??
    `${x.firstName ?? ""} ${x.lastName ?? ""}`.trim(),
  email: x.email ?? "",
});

const partySlice = createSlice({
  name: "party",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // landlords
      .addCase(fetchLandlordsAsync.pending, (state) => {
        state.loadingLandlords = true;
        state.errorLandlords = null;
      })
      .addCase(fetchLandlordsAsync.fulfilled, (state, action) => {
        state.loadingLandlords = false;
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.landlords = list.map(normalize);
      })
      .addCase(fetchLandlordsAsync.rejected, (state, action) => {
        state.loadingLandlords = false;
        state.errorLandlords =
          (action.payload as string) || "Failed to load landlords";
        Toast.fire({ icon: "error", title: state.errorLandlords });
      })

      // tenants
      .addCase(fetchTenantsAsync.pending, (state) => {
        state.loadingTenants = true;
        state.errorTenants = null;
      })
      .addCase(fetchTenantsAsync.fulfilled, (state, action) => {
        state.loadingTenants = false;
        const list = Array.isArray(action.payload) ? action.payload : [];
        console.log("list", list)
        state.tenants = list.map(normalize);
      })
      .addCase(fetchTenantsAsync.rejected, (state, action) => {
        state.loadingTenants = false;
        state.errorTenants =
          (action.payload as string) || "Failed to load tenants";
        Toast.fire({ icon: "error", title: state.errorTenants });
      });
  },
});

export const selectParty = (state: any) => state.party as PartyState;
export default partySlice.reducer;
