"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
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
  disabled?: boolean;
}> = ({ valueWhenClosed, placeholder, loading, emails, onSelectEmail, onAddNew, disabled }) => {
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
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

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
      return;
    }
    const email = filtered[idx];
    if (email) {
      onSelectEmail(email);
      setOpen(false);
      setQuery("");
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
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border-none p-3 pr-9 outline-none"
          onClick={() => !disabled && setOpen(true)}
        />
        {/* caret icon */}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle landlord list"
          onClick={() => {
            if (disabled) return;
            setOpen((o) => !o);
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
              <button
                type="button"
                onMouseEnter={() => setActive(filtered.length)}
                onClick={() => commit(filtered.length)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                  active === filtered.length ? "bg-blue-50" : ""
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-violet-100 text-violet-600">+</span>
                Add new landlord…
              </button>
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

const { values, setFieldValue } = useFormikContext<Record<string, string | number | boolean | undefined>>();
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

  /* sync id/name for existing or clear id for new;
     only collapse "addingNew" if an actual existing is selected */
  useEffect(() => {
    if (selectedExisting) {
      const id = partyId(selectedExisting);
      const name = partyName(selectedExisting);
      if (values[landlordIdName] !== id) setFieldValue(landlordIdName, id);
      if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
      if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) setFieldValue(legacyLandlordNameName, name);
      if (addingNew) setAddingNew(false); // only exit add-new after selecting an existing
    } else {
      if (values[landlordIdName]) setFieldValue(landlordIdName, "");
      // keep name as user-entered when creating new
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExisting, landlordIdName, landlordNameName, legacyLandlordNameName, setFieldValue]);

  /* backfill email ONLY when editing an existing record (has id) and NOT addingNew */
  useEffect(() => {
    if (addingNew) return; // <- critical guard
    if (!values[landlordEmailName] && landlords?.length && values[landlordIdName]) {
      const match = landlords.find((l) => partyId(l) === values[landlordIdName]);
      if (match?.email) setFieldValue(landlordEmailName, match.email);
    }
  }, [addingNew, landlords, values, landlordEmailName, landlordIdName, setFieldValue]);

  /* tenant prefill from logged-in user */
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

    const m =
      tenants.find(
        (t) =>
          (emailFromUser && (t.email ?? "").trim().toLowerCase() === emailFromUser.toLowerCase()) ||
          (nameFromUser && (t.name ?? t.fullName) === nameFromUser)
      ) || undefined;

    if (!values[tenantIdName] && m) setFieldValue(tenantIdName, partyId(m));
  }, [loggedInUser, tenants, tenantIdName, tenantNameName, tenantEmailName, legacyTenantNameName, setFieldValue, values]);

  /* combobox closed value:
     when addingNew, keep this empty so typing in “New Landlord Email” doesn't mirror */
  const landlordEmailDisplay = useMemo(() => {
    if (addingNew) return "";
    return String(values[landlordEmailName] ?? "");
  }, [values, landlordEmailName, addingNew]);

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">2</span>
        Party Information
      </h3>

      {/* ===== Landlord (your original order: Name first, then Email) ===== */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold">Landlord Information</h4>

        {/* Landlord Name (text first) */}
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

        {/* Landlord Email (searchable dropdown with caret + add-new) */}
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
              // id/name will auto-sync if it’s an existing landlord
              setAddingNew(false);
            }}
            onAddNew={() => {
              setFieldValue(landlordIdName, ""); // ensure treated as new
              setAddingNew(true); // show new fields; user will type email below
            }}
          />
        </div>

        {/* New landlord fields (shown only when “Add new landlord…” chosen) */}
        {addingNew && (
          <div className="grid gap-4">
        
            <div className="space-y-1 sm:col-span-1">
              <label className="text-sm font-medium text-gray-700">New Landlord Email</label>
              <input
                type="email"
                name={landlordEmailName}
                placeholder="landlord@domain.com"
                value={String(values[landlordEmailName] ?? "")}
                onChange={(e) => {
                  setFieldValue(landlordEmailName, e.target.value);
                  // still new even if they type an email matching existing; server can dedupe
                  if (values[landlordIdName]) setFieldValue(landlordIdName, "");
                }}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <hr className="my-2 border-gray-200" />

      {/* ===== Tenant (unchanged) ===== */}
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

// "use client";

// import React, { useMemo, useRef, useState, useEffect } from "react";
// import { useFormikContext } from "formik";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchLandlordsAsync, fetchTenantsAsync } from "@/services/auth/partyAsyncThunk";
// import { selectParty } from "@/redux/slices/partySlice";
// import type { AppDispatch, RootState } from "@/redux/store";
// import { getLoggedInUserAsync } from "@/services/dashboard/asyncThunk";
// import type { LoggedInUser } from "@/redux/slices/dashboardSlice";
// import { Plus } from "lucide-react";

// type Props = {
//   landlordIdName?: string;
//   landlordNameName?: string;
//   landlordEmailName?: string;
//   tenantIdName?: string;
//   tenantNameName?: string;
//   tenantEmailName?: string;
//   legacyLandlordNameName?: string; // e.g. "landloardName"
//   legacyTenantNameName?: string;   // e.g. "tenentName"
// };

// type Party = {
//   _id?: string;
//   id?: string;
//   name?: string;
//   fullName?: string;
//   email?: string;
// };

// type PartySlice = {
//   landlords: Party[];
//   tenants: Party[];
//   loadingLandlords: boolean;
//   loadingTenants: boolean;
// };

// function partyId(p?: Party): string {
//   if (!p) return "";
//   return String(p._id ?? p.id ?? "");
// }

// export const PartyDropdowns: React.FC<Props> = ({
//   landlordIdName = "landlordId",
//   landlordNameName = "landlordName",
//   landlordEmailName = "landlordEmail",
//   tenantIdName = "tenantId",
//   tenantNameName = "tenantName",
//   tenantEmailName = "tenantEmail",
//   legacyLandlordNameName = "landloardName",
//   legacyTenantNameName = "tenentName",
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { landlords, tenants, loadingLandlords } =
//     useSelector(selectParty) as PartySlice;

//   const loggedInUser = useSelector(
//     (s: RootState) => s.dashboard.loggedInUser
//   ) as LoggedInUser | null;

//   const { values, setFieldValue } =
//     useFormikContext<Record<string, unknown>>();

//   const [showAddEmail, setShowAddEmail] = useState(false);
//   const addEmailRef = useRef<HTMLInputElement>(null);

//   // Load lists + current user
//   useEffect(() => {
//     dispatch(fetchLandlordsAsync());
//     dispatch(fetchTenantsAsync());
//     dispatch(getLoggedInUserAsync());
//   }, [dispatch]);

//   // Unique landlord emails for the dropdown
//   const landlordEmailOptions = useMemo(() => {
//     const seen = new Set<string>();
//     return (landlords || []).filter((l) => {
//       const e = (l.email || "").trim().toLowerCase();
//       if (!e || seen.has(e)) return false;
//       seen.add(e);
//       return true;
//     });
//   }, [landlords]);

//   // Currently selected landlord by EMAIL (from form value)
//   const selectedLandlordByEmail = useMemo(() => {
//     const email = String(values?.[landlordEmailName] ?? "").trim().toLowerCase();
//     if (!email) return undefined;
//     return landlords.find(
//       (l) => (l.email || "").trim().toLowerCase() === email
//     );
//   }, [landlords, values, landlordEmailName]);

//   // When a known email is selected, sync id + name; otherwise clear id (new landlord)
//   useEffect(() => {
//     if (selectedLandlordByEmail) {
//       const id = partyId(selectedLandlordByEmail);
//       const name = selectedLandlordByEmail.name ?? selectedLandlordByEmail.fullName ?? "";
//       if (values[landlordIdName] !== id) setFieldValue(landlordIdName, id);
//       if (values[landlordNameName] !== name) setFieldValue(landlordNameName, name);
//       if (legacyLandlordNameName && values[legacyLandlordNameName] !== name) {
//         setFieldValue(legacyLandlordNameName, name);
//       }
//     } else {
//       // Treat as new landlord if email doesn't match existing
//       if (values[landlordIdName]) setFieldValue(landlordIdName, "");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedLandlordByEmail, landlordIdName, landlordNameName, legacyLandlordNameName, setFieldValue]);

//   // Backfill email if user is editing and id/name existed first
//   useEffect(() => {
//     if (!values[landlordEmailName] && landlords?.length) {
//       const match = landlords.find(
//         (l) =>
//           partyId(l) === values[landlordIdName] ||
//           (l.name ?? l.fullName) === values[landlordNameName]
//       );
//       if (match?.email) setFieldValue(landlordEmailName, match.email);
//     }
//   }, [landlords, values, landlordEmailName, landlordIdName, landlordNameName, setFieldValue]);

//   // Tenant: prefill from logged-in user
//   useEffect(() => {
//     const nameFromUser = (loggedInUser?.name ?? loggedInUser?.fullName ?? "").trim();
//     const emailFromUser = (loggedInUser?.email ?? "").trim();

//     if (nameFromUser && values[tenantNameName] !== nameFromUser) {
//       setFieldValue(tenantNameName, nameFromUser);
//       if (legacyTenantNameName && values[legacyTenantNameName] !== nameFromUser) {
//         setFieldValue(legacyTenantNameName, nameFromUser);
//       }
//     }
//     if (emailFromUser && values[tenantEmailName] !== emailFromUser) {
//       setFieldValue(tenantEmailName, emailFromUser);
//     }

//     // Try to match tenantId from list
//     const tenantMatch =
//       tenants.find(
//         (t) =>
//           (emailFromUser && (t.email || "").trim().toLowerCase() === emailFromUser.toLowerCase()) ||
//           (nameFromUser && (t.name ?? t.fullName) === nameFromUser)
//       ) || undefined;

//     if (!values[tenantIdName] && tenantMatch) {
//       setFieldValue(tenantIdName, partyId(tenantMatch));
//     }
//   }, [
//     loggedInUser,
//     tenants,
//     tenantIdName,
//     tenantNameName,
//     tenantEmailName,
//     legacyTenantNameName,
//     setFieldValue,
//     values,
//   ]);

//   const openAddEmail = () => {
//     setShowAddEmail(true);
//     // focus after render
//     setTimeout(() => addEmailRef.current?.focus(), 0);
//   };

//   return (
//     <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
//       <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
//         <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">2</span>
//         Party Information
//       </h3>

//       {/* =================== Landlord =================== */}
//       <div className="space-y-4">
//         <h4 className="text-base font-semibold">Landlord Information</h4>

//         {/* Landlord Name (text) */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-700">
//             Landlord Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name={landlordNameName}
//             placeholder="Property Owner or Management Company"
//             value={String(values[landlordNameName] ?? "")}
//             onChange={(e) => setFieldValue(landlordNameName, e.target.value)}
//             className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Landlord Email (dropdown + + button) */}
//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-700">Landlord Email</label>
//           <div className="relative">
//             <select
//               name={landlordEmailName}
//               value={String(values[landlordEmailName] ?? "")}
//               onChange={(e) => setFieldValue(landlordEmailName, e.target.value)}
//               disabled={loadingLandlords}
//               className="w-full rounded-lg border border-gray-300 p-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">
//                 {loadingLandlords ? "Loading emails…" : "Select an email"}
//               </option>
//               {landlordEmailOptions.map((l) => (
//                 <option key={partyId(l)} value={l.email}>
//                   {l.email}
//                 </option>
//               ))}
//             </select>

//             {/* + button */}
//             <button
//               type="button"
//               onClick={openAddEmail}
//               className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 hover:bg-gray-100"
//               aria-label="Add new landlord email"
//               title="Add new landlord email"
//             >
//               <Plus className="h-4 w-4 text-gray-600" />
//             </button>
//           </div>

//           {/* New email field, shown after + */}
//           {showAddEmail && (
//             <input
//               ref={addEmailRef}
//               type="email"
//               placeholder="Add new landlord email"
//               value={String(values[landlordEmailName] ?? "")}
//               onChange={(e) => {
//                 setFieldValue(landlordEmailName, e.target.value);
//                 // Clear id so backend treats as new landlord unless it matches an existing one
//                 if (values[landlordIdName]) setFieldValue(landlordIdName, "");
//               }}
//               className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
//             />
//           )}
//         </div>
//       </div>

//       <hr className="my-2 border-gray-200" />

//       {/* =================== Tenant =================== */}
//       <div className="space-y-4">
//         <h4 className="text-base font-semibold">Tenant Information</h4>

//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-700">
//             Tenant Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name={tenantNameName}
//             placeholder="Your Company Name"
//             value={String(values[tenantNameName] ?? "")}
//             readOnly
//             className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-700"
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="text-sm font-medium text-gray-700">Tenant Email</label>
//           <input
//             type="email"
//             name={tenantEmailName}
//             placeholder="your@company.com"
//             value={String(values[tenantEmailName] ?? "")}
//             readOnly
//             className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-700"
//           />
//         </div>
//       </div>

//       {/* Hidden ids & legacy fields */}
//       <input type="hidden" name={landlordIdName} value={String(values[landlordIdName] ?? "")} readOnly />
//       <input type="hidden" name={tenantIdName} value={String(values[tenantIdName] ?? "")} readOnly />
//       {legacyLandlordNameName && (
//         <input type="hidden" name={legacyLandlordNameName} value={String(values[legacyLandlordNameName] ?? "")} readOnly />
//       )}
//       {legacyTenantNameName && (
//         <input type="hidden" name={legacyTenantNameName} value={String(values[legacyTenantNameName] ?? "")} readOnly />
//       )}
//     </div>
//   );
// };
