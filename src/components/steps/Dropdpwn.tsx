"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
import { selectParty } from "@/redux/slices/partySlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { getLoggedInUserAsync } from "@/services/dashboard/asyncThunk";
import type { LoggedInUser } from "@/redux/slices/dashboardSlice";
import { Plus } from "lucide-react";

type Props = {
  landlordIdName?: string;
  landlordNameName?: string;
  landlordEmailName?: string;
  tenantIdName?: string;
  tenantNameName?: string;
  tenantEmailName?: string;
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

  const loggedInUser = useSelector(
    (s: RootState) => s.dashboard.loggedInUser
  ) as LoggedInUser | null;

  const { values, setFieldValue } =
    useFormikContext<Record<string, unknown>>();

  const [showAddEmail, setShowAddEmail] = useState(false);
  const addEmailRef = useRef<HTMLInputElement>(null);

  // Load lists + current user
  useEffect(() => {
    dispatch(fetchLandlordsAsync());
    dispatch(fetchTenantsAsync());
    dispatch(getLoggedInUserAsync());
  }, [dispatch]);

  // Unique landlord emails for the dropdown
  const landlordEmailOptions = useMemo(() => {
    const seen = new Set<string>();
    return (landlords || []).filter((l) => {
      const e = (l.email || "").trim().toLowerCase();
      if (!e || seen.has(e)) return false;
      seen.add(e);
      return true;
    });
  }, [landlords]);

  // Currently selected landlord by EMAIL (from form value)
  const selectedLandlordByEmail = useMemo(() => {
    const email = String(values?.[landlordEmailName] ?? "").trim().toLowerCase();
    if (!email) return undefined;
    return landlords.find(
      (l) => (l.email || "").trim().toLowerCase() === email
    );
  }, [landlords, values, landlordEmailName]);

  // When a known email is selected, sync id + name; otherwise clear id (new landlord)
  useEffect(() => {
    if (selectedLandlordByEmail) {
      const id = partyId(selectedLandlordByEmail);
      const name = selectedLandlordByEmail.name ?? selectedLandlordByEmail.fullName ?? "";
      if (values[landlordIdName] !== id) setFieldValue(landlordIdName, id);
      if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
      if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) {
        setFieldValue(legacyLandlordNameName, name);
      }
    } else {
      // Treat as new landlord if email doesn't match existing
      if (values[landlordIdName]) setFieldValue(landlordIdName, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLandlordByEmail, landlordIdName, landlordNameName, legacyLandlordNameName, setFieldValue]);

  // Backfill email if user is editing and id/name existed first
  useEffect(() => {
    if (!values[landlordEmailName] && landlords?.length) {
      const match = landlords.find(
        (l) =>
          partyId(l) === values[landlordIdName] ||
          (l.name ?? l.fullName) === values[landlordNameName]
      );
      if (match?.email) setFieldValue(landlordEmailName, match.email);
    }
  }, [landlords, values, landlordEmailName, landlordIdName, landlordNameName, setFieldValue]);

  // Tenant: prefill from logged-in user
  useEffect(() => {
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

    // Try to match tenantId from list
    const tenantMatch =
      tenants.find(
        (t) =>
          (emailFromUser && (t.email || "").trim().toLowerCase() === emailFromUser.toLowerCase()) ||
          (nameFromUser && (t.name ?? t.fullName) === nameFromUser)
      ) || undefined;

    if (!values[tenantIdName] && tenantMatch) {
      setFieldValue(tenantIdName, partyId(tenantMatch));
    }
  }, [
    loggedInUser,
    tenants,
    tenantIdName,
    tenantNameName,
    tenantEmailName,
    legacyTenantNameName,
    setFieldValue,
    values,
  ]);

  const openAddEmail = () => {
    setShowAddEmail(true);
    // focus after render
    setTimeout(() => addEmailRef.current?.focus(), 0);
  };

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">2</span>
        Party Information
      </h3>

      {/* =================== Landlord =================== */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold">Landlord Information</h4>

        {/* Landlord Name (text) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Landlord Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={landlordNameName}
            placeholder="Property Owner or Management Company"
            value={String(values[landlordNameName] ?? "")}
            onChange={(e) => setFieldValue(landlordNameName, e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Landlord Email (dropdown + + button) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Landlord Email</label>
          <div className="relative">
            <select
              name={landlordEmailName}
              value={String(values[landlordEmailName] ?? "")}
              onChange={(e) => setFieldValue(landlordEmailName, e.target.value)}
              disabled={loadingLandlords}
              className="w-full rounded-lg border border-gray-300 p-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loadingLandlords ? "Loading emails…" : "Select an email"}
              </option>
              {landlordEmailOptions.map((l) => (
                <option key={partyId(l)} value={l.email}>
                  {l.email}
                </option>
              ))}
            </select>

            {/* + button */}
            <button
              type="button"
              onClick={openAddEmail}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 hover:bg-gray-100"
              aria-label="Add new landlord email"
              title="Add new landlord email"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* New email field, shown after + */}
          {showAddEmail && (
            <input
              ref={addEmailRef}
              type="email"
              placeholder="Add new landlord email"
              value={String(values[landlordEmailName] ?? "")}
              onChange={(e) => {
                setFieldValue(landlordEmailName, e.target.value);
                // Clear id so backend treats as new landlord unless it matches an existing one
                if (values[landlordIdName]) setFieldValue(landlordIdName, "");
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      {/* =================== Tenant =================== */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold">Tenant Information</h4>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Tenant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name={tenantNameName}
            placeholder="Your Company Name"
            value={String(values[tenantNameName] ?? "")}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-700"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tenant Email</label>
          <input
            type="email"
            name={tenantEmailName}
            placeholder="your@company.com"
            value={String(values[tenantEmailName] ?? "")}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-700"
          />
        </div>
      </div>

      {/* Hidden ids & legacy fields */}
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
