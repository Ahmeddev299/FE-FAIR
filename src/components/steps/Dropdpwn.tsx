"use client";

import React, { useMemo } from "react";
import { useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
import { selectParty } from "@/redux/slices/partySlice";
import type { AppDispatch } from "@/redux/store";

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
  legacyLandlordNameName = "landloardName", // <- covers the typo
  legacyTenantNameName = "tenentName",      // <- covers a common typo
}) => {

  const dispatch = useDispatch<AppDispatch>();
  const { landlords, tenants, loadingLandlords, loadingTenants } =
    useSelector(selectParty) as PartySlice;

  // Avoid `any` by using a generic record for dynamic key access.
  const { values, setFieldValue } = useFormikContext<Record<string, unknown>>();

  React.useEffect(() => {
    dispatch(fetchLandlordsAsync());
    dispatch(fetchTenantsAsync());
  }, [dispatch]);


  // Ensure ids exist in form state so controlled <select> has a value
  React.useEffect(() => {
    if (values[landlordIdName] === undefined) setFieldValue(landlordIdName, "");
    if (values[tenantIdName] === undefined) setFieldValue(tenantIdName, "");
  }, [values, landlordIdName, tenantIdName, setFieldValue]);

  const selectedLandlord = useMemo(() => {
    const id = String(values?.[landlordIdName] ?? "");
    return landlords.find((l: Party) => partyId(l) === id);
  }, [landlords, values, landlordIdName]);

  const selectedTenant = useMemo(() => {
    const id = String(values?.[tenantIdName] ?? "");
    return tenants.find((t: Party) => partyId(t) === id);
  }, [tenants, values, tenantIdName]);

  React.useEffect(() => {
    if (!selectedLandlord) return;  // 👈 prevents wiping initial values
    const name = selectedLandlord.name ?? selectedLandlord.fullName ?? "";
    const email = selectedLandlord.email ?? "";
    if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
    if (values[landlordEmailName] !== email) setFieldValue(landlordEmailName, email);
    if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) {
      setFieldValue(legacyLandlordNameName, name);
    }
  }, [selectedLandlord, landlordNameName, landlordEmailName, legacyLandlordNameName, setFieldValue, values]);

  React.useEffect(() => {
    if (!selectedTenant) return;    // 👈 prevents wiping initial values
    const name = selectedTenant.name ?? selectedTenant.fullName ?? "";
    const email = selectedTenant.email ?? "";
    if (values[tenantNameName] !== name) setFieldValue(tenantNameName, name);
    if (values[tenantEmailName] !== email) setFieldValue(tenantEmailName, email);
    if (legacyTenantNameName && values[legacyTenantNameName] !== name) {
      setFieldValue(legacyTenantNameName, name);
    }
  }, [selectedTenant, tenantNameName, tenantEmailName, legacyTenantNameName, setFieldValue, values]);


  // Hydrate landlordId/tenantId once when editing
  React.useEffect(() => {
    // Landlord
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

    // Tenant
    if (!values[tenantIdName] && tenants?.length) {
      const matchT = tenants.find(
        (t) =>
          t.email === values[tenantEmailName] ||
          (t.name ?? t.fullName) === values[tenantNameName]
      );
      if (matchT) {
        setFieldValue(tenantIdName, partyId(matchT));
      }
    }
  }, [
    landlords,
    tenants,
    values,
    landlordIdName,
    tenantIdName,
    landlordEmailName,
    tenantEmailName,
    landlordNameName,
    tenantNameName,
    setFieldValue,
  ]);

  return (
    <div className="space-y-6 border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
        Party Information
      </h3>
      <p className="text-sm text-gray-600">Landlord email: {String(values[landlordEmailName] ?? '')}</p>

      {/* Landlord */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Landlord</h4>
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
      </div>

      {/* Tenant */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Tenant</h4>
        <select
          name={tenantIdName}
          value={String(values[tenantIdName] ?? "")}
          onChange={(e) => setFieldValue(tenantIdName, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loadingTenants}
        >
          <option value="">{loadingTenants ? "Loading tenants…" : "Select a tenant"}</option>
          {Array.isArray(tenants) &&
            tenants.map((t: Party) => (
              <option key={partyId(t)} value={partyId(t)}>
                {(t.name ?? t.fullName ?? "").trim()} — {t.email}
              </option>
            ))}
        </select>
      </div>

      {/* keep hidden fields if backend still expects them */}
      <input type="hidden" name={landlordNameName} value={String(values[landlordNameName] ?? "")} readOnly />
      <input type="hidden" name={landlordEmailName} value={String(values[landlordEmailName] ?? "")} readOnly />
      <input type="hidden" name={tenantNameName} value={String(values[tenantNameName] ?? "")} readOnly />
      <input type="hidden" name={tenantEmailName} value={String(values[tenantEmailName] ?? "")} readOnly />

      {/* legacy hidden name fields */}
      {legacyLandlordNameName && (
        <input type="hidden" name={legacyLandlordNameName} value={String(values[legacyLandlordNameName] ?? "")} readOnly />
      )}
      {legacyTenantNameName && (
        <input type="hidden" name={legacyTenantNameName} value={String(values[legacyTenantNameName] ?? "")} readOnly />
      )}
    </div>
  );
};
