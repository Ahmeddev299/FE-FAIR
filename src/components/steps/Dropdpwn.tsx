"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFormikContext, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
import { selectParty } from "@/redux/slices/partySlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { getLoggedInUserAsync } from "@/services/dashboard/asyncThunk";
import type { LoggedInUser } from "@/redux/slices/dashboardSlice";

type Props = {
  landlordIdName?: string;
  landlordNameName?: string;
  landlordEmailName?: string;
  tenantIdName?: string;
  tenantNameName?: string;
  tenantEmailName?: string;
  legacyLandlordNameName?: string;
  legacyTenantNameName?: string;
};

type Party = { _id?: string; id?: string; name?: string; fullName?: string; email?: string };
type PartySlice = { landlords: Party[]; tenants: Party[]; loadingLandlords: boolean; loadingTenants: boolean };

const partyId = (p?: Party) => String(p?._id ?? p?.id ?? "");
const partyName = (p: Party) => (p.name ?? p.fullName ?? "").trim();

/* dependency-free searchable select for emails (with caret + “Add new…”) */
const EmailCombobox: React.FC<{
  valueWhenClosed: string;
  placeholder?: string;
  loading?: boolean;
  emails: string[];
  onSelectEmail: (email: string) => void;
  onAddNew: () => void;
  onClose?: () => void; // <-- added so we can set touched
  disabled?: boolean;
}> = ({ valueWhenClosed, placeholder, loading, emails, onSelectEmail, onAddNew, onClose, disabled }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        onClose?.();
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [onClose]);

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return emails;
    return emails.filter((e) => e.toLowerCase().includes(s));
  }, [emails, query]);

  const totalRows = filtered.length + 1; // +1 for “Add new…”
  const commit = (idx: number) => {
    if (idx === filtered.length) {
      onAddNew();
      setOpen(false);
      setQuery("");
      onClose?.();
      return;
    }
    const email = filtered[idx];
    if (email) {
      onSelectEmail(email);
      setOpen(false);
      setQuery("");
      onClose?.();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`relative rounded-lg border border-gray-300 ${disabled ? "bg-gray-100" : "bg-white"} focus-within:ring-2 focus-within:ring-blue-500`}
      >
        <input
          ref={inputRef}
          disabled={disabled}
          value={open ? query : valueWhenClosed}
          onChange={(e) => {
            if (!open) setOpen(true);
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
              return;
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, totalRows - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              commit(active);
            } else if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
              onClose?.();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border-none p-3 pr-9 outline-none"
          onClick={() => !disabled && setOpen(true)}
          onBlur={() => {
            // when the input itself blurs (e.g., tabbing out)
            if (!open) onClose?.();
          }}
        />
        {/* caret icon */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle landlord list"
          onClick={() => {
            if (disabled) return;
            setOpen((o) => !o);
            if (open) onClose?.();
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {open && !disabled && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Loading…</div>
          ) : (
            <>
              {filtered.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No matches</div>}
              <button
                type="button"
                onMouseEnter={() => setActive(filtered.length)}
                onClick={() => commit(filtered.length)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${active === filtered.length ? "bg-blue-50" : ""}`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-violet-100 text-violet-600">+</span>
                Add new landlord…
              </button>
              {filtered.map((email, idx) => (
                <button
                  key={email}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => commit(idx)}
                  className={`block w-full truncate px-3 py-2 text-left text-sm ${active === idx ? "bg-blue-50" : ""}`}
                >
                  {email}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

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
  const { landlords, tenants, loadingLandlords } = useSelector(selectParty) as PartySlice;
  const loggedInUser = useSelector((s: RootState) => s.dashboard.loggedInUser) as LoggedInUser | null;

  const {
    values,
    setFieldValue,
    setFieldTouched, // <-- so errors show
  } = useFormikContext<Record<string, string | number | boolean | undefined>>();
  const [addingNew, setAddingNew] = useState(false);

  /* load lists + current user */
  useEffect(() => {
    dispatch(fetchLandlordsAsync());
    dispatch(fetchTenantsAsync());
    dispatch(getLoggedInUserAsync());
  }, [dispatch]);

  /* unique landlord emails */
  const landlordEmails = useMemo(() => {
    const seen = new Set<string>();
    const arr: string[] = [];
    (landlords || []).forEach((l) => {
      const e = (l.email ?? "").trim();
      if (e && !seen.has(e.toLowerCase())) {
        seen.add(e.toLowerCase());
        arr.push(e);
      }
    });
    return arr;
  }, [landlords]);

  /* selected existing by email */
  const selectedExisting = useMemo(() => {
    const email = String(values?.[landlordEmailName] ?? "").trim().toLowerCase();
    if (!email) return undefined;
    return landlords.find((l) => (l.email ?? "").trim().toLowerCase() === email);
  }, [landlords, values, landlordEmailName]);

  /* sync id/name for existing or clear id for new */
  useEffect(() => {
    if (selectedExisting) {
      const id = partyId(selectedExisting);
      const name = partyName(selectedExisting);
      if (values[landlordIdName] !== id) setFieldValue(landlordIdName, id);
      if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
      if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) setFieldValue(legacyLandlordNameName, name);
      if (addingNew) setAddingNew(false);
    } else {
      if (values[landlordIdName]) setFieldValue(landlordIdName, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExisting, landlordIdName, landlordNameName, legacyLandlordNameName, setFieldValue]);

  /* backfill email when editing existing (not addingNew) */
  useEffect(() => {
    if (addingNew) return;
    if (!values[landlordEmailName] && landlords?.length && values[landlordIdName]) {
      const match = landlords.find((l) => partyId(l) === values[landlordIdName]);
      if (match?.email) setFieldValue(landlordEmailName, match.email);
    }
  }, [addingNew, landlords, values, landlordEmailName, landlordIdName, setFieldValue]);

  /* tenant prefill from logged-in user */
  useEffect(() => {
    const nameFromUser = (loggedInUser?.name ?? loggedInUser?.fullName ?? "").trim();
    const emailFromUser = (loggedInUser?.email ?? "").trim();

    const m =
      tenants.find(
        (t) =>
          (emailFromUser && (t.email ?? "").trim().toLowerCase() === emailFromUser.toLowerCase()) ||
          (nameFromUser && (t.name ?? t.fullName) === nameFromUser)
      ) || undefined;

    if (!values[tenantIdName] && m) setFieldValue(tenantIdName, partyId(m));
  }, [loggedInUser, tenants, tenantIdName, setFieldValue, values]);

  /* combobox closed value */
  const landlordEmailDisplay = useMemo(() => {
    if (addingNew) return "";
    return String(values[landlordEmailName] ?? "");
  }, [values, landlordEmailName, addingNew]);

  /* Field helper to reduce repetition */
  const onBlurTouch = (name: string) => () => setFieldTouched(name, true);

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">2</span>
        Party Information
      </h3>

      {/* Landlord */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold">Landlord Information</h4>

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
            onBlur={onBlurTouch(landlordNameName)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          <ErrorMessage name={landlordNameName} component="div" className="text-sm text-red-500" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Landlord Email</label>
          <EmailCombobox
            disabled={loadingLandlords}
            valueWhenClosed={landlordEmailDisplay}
            placeholder={loadingLandlords ? "Loading emails…" : "Type to search emails…"}
            loading={loadingLandlords}
            emails={landlordEmails}
            onSelectEmail={(email) => {
              setFieldValue(landlordEmailName, email);
              setAddingNew(false);
              setFieldTouched(landlordEmailName, true);
            }}
            onAddNew={() => {
              setFieldValue(landlordIdName, "");
              setAddingNew(true);
              setFieldTouched(landlordEmailName, true);
            }}
            onClose={() => setFieldTouched(landlordEmailName, true)}
          />
          <ErrorMessage name={landlordEmailName} component="div" className="text-sm text-red-500" />
        </div>

        {addingNew && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">New Landlord Email</label>
            <input
              type="email"
              name={landlordEmailName}
              placeholder="landlord@domain.com"
              value={String(values[landlordEmailName] ?? "")}
              onChange={(e) => {
                setFieldValue(landlordEmailName, e.target.value);
                if (values[landlordIdName]) setFieldValue(landlordIdName, "");
              }}
              onBlur={onBlurTouch(landlordEmailName)}
              className="w-full rounded-lg border C p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name={landlordEmailName} component="div" className="text-sm text-red-500" />
          </div>
        )}

        {/* Landlord Address – structured */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Landlord Address</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                name="landlord_address_S1"
                placeholder="Street Address Line 1"
                value={String(values["landlord_address_S1"] ?? "")}
                onChange={(e) => setFieldValue("landlord_address_S1", e.target.value)}
                onBlur={onBlurTouch("landlord_address_S1")}
                className="w-full rounded-lg border border-gray-300 p-3 "
              />
              <ErrorMessage name="landlord_address_S1" component="div" className="text-sm text-red-500" />
            </div>
            <div className="sm:col-span-2">
              <input
                name="landlord_address_S2"
                placeholder="Street Address Line 2 (optional)"
                value={String(values["landlord_address_S2"] ?? "")}
                onChange={(e) => setFieldValue("landlord_address_S2", e.target.value)}
                onBlur={onBlurTouch("landlord_address_S2")}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
              <ErrorMessage name="landlord_address_S2" component="div" className="text-sm text-red-500" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  name="landlord_city"
                  placeholder="City"
                  value={String(values["landlord_city"] ?? "")}
                  onChange={(e) => setFieldValue("landlord_city", e.target.value)}
                  onBlur={onBlurTouch("landlord_city")}
                  className=" rounded-lg border border-gray-300 p-3"
                />
                <ErrorMessage name="landlord_city" component="div" className="text-sm text-red-500" />

              </div>

              <div className="flex-1">
                <input
                  name="landlord_state"
                  placeholder="State"
                  value={String(values["landlord_state"] ?? "")}
                  onChange={(e) => setFieldValue("landlord_state", e.target.value)}
                  onBlur={onBlurTouch("landlord_state")}
                  className=" rounded-lg border border-gray-300 p-3"
                />
                <ErrorMessage name="landlord_state" component="div" className="text-sm text-red-500" />

              </div>
            </div>
          </div>
          <div className="flex-1">
            <input
              name="landlord_zip"
              placeholder="Zip Code"
              value={String(values["landlord_zip"] ?? "")}
              onChange={(e) => setFieldValue("landlord_zip", e.target.value)}
              onBlur={onBlurTouch("landlord_zip")}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
            <ErrorMessage name="landlord_zip" component="div" className="text-sm text-red-500" />

          </div>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />

      {/* Tenant */}
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
            onChange={(e) => setFieldValue(tenantNameName, e.target.value)}
            onBlur={onBlurTouch(tenantNameName)}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700"
          />
          <ErrorMessage name={tenantNameName} component="div" className="text-sm text-red-500" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tenant Email</label>
          <input
            type="email"
            name={tenantEmailName}
            placeholder="your@company.com"
            value={String(values[tenantEmailName] ?? "")}
            onChange={(e) => setFieldValue(tenantEmailName, e.target.value)}
            onBlur={onBlurTouch(tenantEmailName)}
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-700"
          />
          <ErrorMessage name={tenantEmailName} component="div" className="text-sm text-red-500" />
        </div>

        {/* Tenant Address – structured */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tenant Address</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                name="tenant_address_S1"
                placeholder="Street Address Line 1"
                value={String(values["tenant_address_S1"] ?? "")}
                onChange={(e) => setFieldValue("tenant_address_S1", e.target.value)}
                onBlur={onBlurTouch("tenant_address_S1")}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-700"
              />
              <ErrorMessage name="tenant_address_S1" component="div" className="text-sm text-red-500" />
            </div>
            <div className="sm:col-span-2">
              <input
                name="tenant_address_S2"
                placeholder="Street Address Line 2 (optional)"
                value={String(values["tenant_address_S2"] ?? "")}
                onChange={(e) => setFieldValue("tenant_address_S2", e.target.value)}
                onBlur={onBlurTouch("tenant_address_S2")}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-700"
              />
              <ErrorMessage name="tenant_address_S2" component="div" className="text-sm text-red-500" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  name="tenant_city"
                  placeholder="City"
                  value={String(values["tenant_city"] ?? "")}
                  onChange={(e) => setFieldValue("tenant_city", e.target.value)}
                  onBlur={onBlurTouch("tenant_city")}
                  className=" rounded-lg border border-gray-300 p-3 text-gray-700"
                />
                <ErrorMessage name="tenant_city" component="div" className="text-sm text-red-500" />

              </div>


              <div className="flex-1">
                <input
                  name="tenant_state"
                  placeholder="State"
                  value={String(values["tenant_state"] ?? "")}
                  onChange={(e) => setFieldValue("tenant_state", e.target.value)}
                  onBlur={onBlurTouch("tenant_state")}
                  className="rounded-lg border p-3 border-gray-300 text-gray-700"
                />
                <ErrorMessage name="tenant_state" component="div" className="text-sm text-red-500" />

              </div>
            </div>
          </div>
          <div className="flex-1">
            <input
              name="tenant_zip"
              placeholder="Zip Code"
              value={String(values["tenant_zip"] ?? "")}
              onChange={(e) => setFieldValue("tenant_zip", e.target.value)}
              onBlur={onBlurTouch("tenant_zip")}
              className="rounded-lg border p-3 border-gray-300 text-gray-700"
            />
            <ErrorMessage name="tenant_zip" component="div" className="text-sm text-red-500" />

          </div>
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
