"use client";

import React, { useMemo } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
import { selectParty } from "@/redux/slices/partySlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { getLoggedInUserAsync } from "@/services/dashboard/asyncThunk"; // ✅ fetch current user
import type { LoggedInUser } from "@/redux/slices/dashboardSlice";

type Props = {
  landlordIdName?: string;     // default: landlordId
  landlordNameName?: string;   // default: landlordName
  landlordEmailName?: string;  // default: landlordEmail
  tenantIdName?: string;       // default: tenantId
  tenantNameName?: string;     // default: tenantName
  tenantEmailName?: string;    // default: tenantEmail

  // Optional legacy keys if other parts of your form still read them
  legacyLandlordNameName?: string; // e.g. "landloardName"
  legacyTenantNameName?: string;   // e.g. "tenentName"
};

type Party = {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
};

type PartySlice = {
  landlords: Party[];
  tenants: Party[];
  loadingLandlords: boolean;
  loadingTenants: boolean;
};

function partyId(p?: Party): string {
  if (!p) return "";
  return String(p._id ?? p.id ?? "");
}

export const PartyDropdowns: React.FC<Props> = ({
  landlordIdName = "landlordId",
  landlordNameName = "landlordName",
  landlordEmailName = "landlordEmail",
  tenantIdName = "tenantId",
  tenantNameName = "tenantName",
  tenantEmailName = "tenantEmail",
  legacyLandlordNameName = "landloardName",
  legacyTenantNameName = "tenentName",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { landlords, tenants, loadingLandlords } =
    useSelector(selectParty) as PartySlice;

  // 👤 current logged-in user from dashboard slice
  const loggedInUser = useSelector((s: RootState) => s.dashboard.loggedInUser) as LoggedInUser | null;

  // Formik access with dynamic keys
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();

  // Load lists + current user
  React.useEffect(() => {
    dispatch(fetchLandlordsAsync());
    dispatch(fetchTenantsAsync());
    dispatch(getLoggedInUserAsync());
  }, [dispatch]);

  // Ensure ids exist so selects/hidden inputs are controlled
  React.useEffect(() => {
    if (values[landlordIdName] === undefined) setFieldValue(landlordIdName, "");
    if (values[tenantIdName] === undefined) setFieldValue(tenantIdName, "");
  }, [values, landlordIdName, tenantIdName, setFieldValue]);

  const selectedLandlord = useMemo(() => {
    const id = String(values?.[landlordIdName] ?? "");
    return landlords.find((l: Party) => partyId(l) === id);
  }, [landlords, values, landlordIdName]);

  // Try to map logged-in user to an existing tenant party (for tenantId)
  const tenantMatchFromUser = useMemo(() => {
    if (!loggedInUser?.email && !loggedInUser?.name && !loggedInUser?.fullName) return undefined;
    return tenants.find(
      (t) =>
        (loggedInUser?.email && t.email === loggedInUser.email) ||
        (loggedInUser?.name && (t.name ?? t.fullName) === loggedInUser.name) ||
        (loggedInUser?.fullName && (t.name ?? t.fullName) === loggedInUser.fullName)
    );
  }, [tenants, loggedInUser]);

  // Sync landlord fields to form when selection changes
  React.useEffect(() => {
    if (!selectedLandlord) return;
    const name = selectedLandlord.name ?? selectedLandlord.fullName ?? "";
    const email = selectedLandlord.email ?? "";
    if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
    if (values[landlordEmailName] !== email) setFieldValue(landlordEmailName, email);
    if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) {
      setFieldValue(legacyLandlordNameName, name);
    }
  }, [selectedLandlord, landlordNameName, landlordEmailName, legacyLandlordNameName, setFieldValue, values]);

  // Initialize tenant fields from the logged-in user
  React.useEffect(() => {
    const nameFromUser = (loggedInUser?.name ?? loggedInUser?.fullName ?? "").trim();
    const emailFromUser = (loggedInUser?.email ?? "").trim();

    if (nameFromUser && values[tenantNameName] !== nameFromUser) {
      setFieldValue(tenantNameName, nameFromUser);
      if (legacyTenantNameName && values[legacyTenantNameName] !== nameFromUser) {
        setFieldValue(legacyTenantNameName, nameFromUser);
      }
    }
    if (emailFromUser && values[tenantEmailName] !== emailFromUser) {
      setFieldValue(tenantEmailName, emailFromUser);
    }

    // If we can match this user to an existing tenant in the list, set tenantId
    if (!values[tenantIdName] && tenantMatchFromUser) {
      setFieldValue(tenantIdName, partyId(tenantMatchFromUser));
    }
  }, [
    loggedInUser,
    tenants,
    tenantMatchFromUser,
    tenantIdName,
    tenantNameName,
    tenantEmailName,
    legacyTenantNameName,
    setFieldValue,
    values,
  ]);

  // Backfill landlordId if editing with existing name/email
  React.useEffect(() => {
    if (!values[landlordIdName] && landlords?.length) {
      const matchL = landlords.find(
        (l) =>
          l.email === values[landlordEmailName] ||
          (l.name ?? l.fullName) === values[landlordNameName]
      );
      if (matchL) {
        setFieldValue(landlordIdName, partyId(matchL));
      }
    }
  }, [landlords, values, landlordIdName, landlordEmailName, landlordNameName, setFieldValue]);

  return (
    <div className="space-y-6 border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
        Party Information
      </h3>

      {/* Landlord */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">Landlord Information</h4>

        {/* landlord selector */}
        <select
          name={landlordIdName}
          value={String(values[landlordIdName] ?? "")}
          onChange={(e) => setFieldValue(landlordIdName, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loadingLandlords}
        >
          <option value="">{loadingLandlords ? "Loading landlords…" : "Select a landlord"}</option>
          {Array.isArray(landlords) &&
            landlords.map((l: Party) => (
              <option key={partyId(l)} value={partyId(l)}>
                {(l.name ?? l.fullName ?? "").trim()} — {l.email}
              </option>
            ))}
        </select>

        {/* landlord name/email inputs */}
        <input
          type="text"
          name={landlordNameName}
          placeholder="Property Owner or Management Company"
          value={String(values[landlordNameName] ?? "")}
          onChange={(e) => setFieldValue(landlordNameName, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          name={landlordEmailName}
          placeholder="landlord@example.com"
          value={String(values[landlordEmailName] ?? "")}
          onChange={(e) => setFieldValue(landlordEmailName, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tenant */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">Tenant Information</h4>

        {/* read-only, prefilled from current user */}
        <input
          type="text"
          name={tenantNameName}
          placeholder="Your Company Name"
          value={String(values[tenantNameName] ?? "")}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
        />
        <input
          type="email"
          name={tenantEmailName}
          placeholder="your@company.com"
          value={String(values[tenantEmailName] ?? "")}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
        />
      </div>

      {/* Hidden ids & legacy fields (if backend expects them) */}
      <input type="hidden" name={landlordIdName} value={String(values[landlordIdName] ?? "")} readOnly />
      <input type="hidden" name={tenantIdName} value={String(values[tenantIdName] ?? "")} readOnly />
      {legacyLandlordNameName && (
        <input type="hidden" name={legacyLandlordNameName} value={String(values[legacyLandlordNameName] ?? "")} readOnly />
      )}
      {legacyTenantNameName && (
        <input type="hidden" name={legacyTenantNameName} value={String(values[legacyTenantNameName] ?? "")} readOnly />
      )}
    </div>
  );
};
