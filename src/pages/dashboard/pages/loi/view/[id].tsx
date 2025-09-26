import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, Edit3, Download as DownloadIcon } from "lucide-react";
import { getLOIDetailsById } from "@/services/loi/asyncThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";

// NEW: for downloading/export
import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import { exportLoiToDocx } from "@/utils/exportDocx";
// If you don't have this yet, add in your service:
// export const dashboardStatusService = { async downloadLoiById(id: string) { return api.get(`/loi/${id}/download`); } }
import axios from "axios";
import Config from "@/config/index";


/* ---------------- Types (unchanged) ---------------- */
type MaintenanceSide = { landlord?: boolean; tenant?: boolean };
type Maintenance = {
  commonAreas?: MaintenanceSide;
  electrical?: MaintenanceSide;
  hvac?: MaintenanceSide;
  nonStructural?: MaintenanceSide;
  plumbing?: MaintenanceSide;
  specialEquipment?: MaintenanceSide;
  structural?: MaintenanceSide;
  utilities?: MaintenanceSide;
};

type LeaseTerms = {
  leaseType?: string;
  leaseDuration?: number | string;
  startDate?: string;
  rentstartDate?: string;
  monthlyRent?: number | string;
  securityDeposit?: number | string;
  renewalYears?: number | null;
  renewalOptionsCount?: number | null;
  includeRenewalOption?: boolean;
  prepaidRent?: number | string;
  RentEscalation?: number | null;
  rentEscalationPercent?: number | null;
};

type AdditionalDetails = {
  tenantImprovement?: string;
  specialConditions?: string;
  tenantImprovement_check?: boolean;
  Miscellaneous_items?: string[];
  contingencies?: string[];
  improvementAllowanceAmount?: number;
  improvementAllowanceEnabled?: boolean;
  leaseToPurchase?: boolean;
  leaseToPurchaseDuration? : string
};

type PropertyDetails = {
  propertyType?: string;
  propertySize?: number | string;
  intendedUse?: string;
  hasExtraSpace?: boolean;
  patio?: string;
  exclusiveUse?: boolean | string;
  amenities?: string[] | string;
  utilities?: string[];
  maintenance?: Maintenance;
  deliveryCondition?: string;
};

type Party = {
  landlord_name?: string;
  landlord_email?: string;
  tenant_name?: string;
  tenant_email?: string;
  landlord_home_town_address?: string;
  tenant_home_town_address?: string;
};

type ShapedLoi = {
  id: string;
  title: string;
  address: string;
  status: string;
  created: string | null;
  updated: string | null;
  userName: string;
  addFileNumber?: number | string;
  party: Party;
  leaseTerms?: LeaseTerms;
  additionalDetails?: AdditionalDetails;
  propertyDetails?: PropertyDetails;
};

const StatusPill: React.FC<{ value?: string }> = ({ value }) => {
  const s = (value || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    draft: `${base} bg-gray-100 text-gray-800`,
    available: `${base} bg-green-100 text-green-800`,
    pending: `${base} bg-yellow-100 text-yellow-800`,
    active: `${base} bg-blue-100 text-blue-800`,
    "in review": `${base} bg-purple-100 text-purple-800`,
    terminated: `${base} bg-red-100 text-red-800`,
    submitted: `${base} bg-blue-100 text-blue-800`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-800`}>{value || "—"}</span>;
};

/* ---------------- helpers (unchanged) ---------------- */
const asArray = (v?: string[] | string): string[] =>
  Array.isArray(v) ? v : (typeof v === "string" && v.trim() ? [v.trim()] : []);

const yesNo = (v?: boolean | string) => {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return ["yes", "true", "1"].includes(v.toLowerCase()) ? "Yes" : "No";
  return "—";
};

type UnknownRecord = Record<string, unknown>;

type LoiLike = {
  id?: unknown;
  _id?: unknown;
  title?: unknown;
  propertyAddress?: unknown;
  property_address?: unknown;
  submit_status?: unknown;
  status?: unknown;
  created_at?: unknown;
  createdAt?: unknown;
  updated_at?: unknown;
  updatedAt?: unknown;
  user_name?: unknown;
  addFileNumber?: unknown;
  partyInfo?: unknown;
  leaseTerms?: unknown;
  additionalDetails?: unknown;
  propertyDetails?: unknown;
};

const toStringOr = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback;

const toNullableString = (v: unknown): string | null =>
  typeof v === "string" ? v : null;

const toNumOrStr = (v: unknown): number | string | undefined =>
  typeof v === "number" || typeof v === "string" ? v : undefined;

const toObj = <T extends object>(v: unknown): T | undefined =>
  v !== null && typeof v === "object" ? (v as T) : undefined;

/** Accepts raw object or envelope { data: {...} } and shapes for display */
const shapeLoi = (raw: unknown): ShapedLoi | null => {
  if (!raw) return null;
  const maybeEnvelope = raw as UnknownRecord;
  const base: UnknownRecord =
    typeof maybeEnvelope?.data === "object" && maybeEnvelope.data !== null
      ? (maybeEnvelope.data as UnknownRecord)
      : maybeEnvelope;

  const data = base as LoiLike;

  const idRaw = data.id ?? data._id ?? "";
  const createdRaw = data.created_at ?? data.createdAt ?? null;
  const updatedRaw = data.updated_at ?? data.updatedAt ?? null;

  return {
    id: toStringOr(idRaw).trim(),
    title: toStringOr(data.title),
    address: toStringOr(data.propertyAddress ?? data.property_address),
    status: toStringOr(data.submit_status ?? data.status),
    created: createdRaw === null ? null : toNullableString(createdRaw),
    updated: updatedRaw === null ? null : toNullableString(updatedRaw),
    userName: toStringOr(data.user_name),
    addFileNumber: toNumOrStr(data.addFileNumber),
    party: toObj<Party>(data.partyInfo) ?? {},
    leaseTerms: toObj<LeaseTerms>(data.leaseTerms),
    additionalDetails: toObj<AdditionalDetails>(data.additionalDetails),
    propertyDetails: toObj<PropertyDetails>(data.propertyDetails),
  };
};

/* ---------------- NORMALIZE download response to server format ---------------- */
// If your export function expects a specific server DTO, keep this flexible:
export type LoiServerData = Record<string, unknown>;
export function normalizeLoiResponse(response: unknown): LoiServerData {
  const maybeEnvelope = response as { success?: boolean; status?: number; message?: string; data?: LoiServerData } | undefined;
  const normalized = maybeEnvelope?.data ?? (response as LoiServerData);
  if (!normalized || typeof normalized !== "object") {
    throw new Error("Malformed LOI data from server");
  }
  return normalized;
}

/* ---------------- Component ---------------- */
export default function SingleLoiPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: queryId } = router.query;

  const { currentLOI, isLoading, loiError } = useAppSelector((s: RootState) => s.loi);
  const loi = useMemo(() => shapeLoi(currentLOI), [currentLOI]);

  useEffect(() => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) dispatch(getLOIDetailsById(String(id)));
  }, [dispatch, queryId]);

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  // tiny util to prevent forever-hangs
  // export const withTimeout = <T,>(p: Promise<T>, ms = 30000) =>
  //   Promise.race([
  //     p,
  //     new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Download timed out")), ms)),
  //   ]);

  const handleDownload = async () => {
    // guard against double click / HMR re-entryp
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloading(true);

    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication tokePn not found");

      // fetch server-side LOI payload

      const response = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_tempalte_data`,
        currentLOI,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const maybe = response as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message || "Failed to fetch LOI");
      if (maybe?.message) Toast.fire({ icon: "success", title: maybe.message });

      const data: LoiServerData = normalizeLoiResponse(response);

      // export and wait until file is created
      await exportLoiToDocx(data);

      // show success only if still mounted
      if (isMountedRef.current) {
        Toast.fire({ icon: "success", title: "LOI exported successfully" });
      }
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Could not reset password";


      Toast.fire({ icon: "warning", title: { msg } });
      router.push("/auth/verify-otp");

    } finally {
      // IMPORTANT: clear the ref FIRST, then the state
      downloadingRef.current = false;
      // Always turn loader off; don't rely on a possibly-stale guard here
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      {(isLoading || isDownloading) && <LoadingOverlay visible />}

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {!isLoading && !loiError && loi && (
          <div className={`bg-white rounded-xl p-6 space-y-6 ${isDownloading ? "opacity-90 pointer-events-none" : ""}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {loi.title || "Untitled LOI"}
                </h1>
                <div className="mt-1 text-sm text-gray-500">{loi.address || "—"}</div>
                <div className="mt-1 text-xs text-gray-500">File #: {loi.addFileNumber ?? "—"}</div>
                {loi.userName && (
                  <div className="mt-1 text-xs text-gray-400">Owner: {loi.userName}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill value={loi.status} />

                {/* Edit */}
                <button
                  onClick={() => router.push(`/dashboard/pages/loi/edit/${loi.id}`)}
                  title="Edit LOI"
                  aria-label="Edit LOI"
                  className="
      inline-flex h-10 items-center w-[130px] gap-5 rounded-xl px-3
      border border-gray-300 bg-white text-gray-700
      shadow-sm hover:bg-gray-50 active:bg-gray-100
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
      transition-colors
    "
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit LOI </span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  title="Download LOI"
                  aria-label="Download LOI"
                  className="
      inline-flex h-10 items-center gap-2 w-[130px] rounded-xl px-3
      bg-emerald-600 text-white shadow-sm
      hover:bg-emerald-700 active:bg-emerald-800
      disabled:bg-emerald-600/60 disabled:cursor-not-allowed
      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60
      transition-colors
    "
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isDownloading ? "Downloading…" : "Download"}
                  </span>
                </button>
              </div>

            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Landlord</div>
                <div className="text-sm text-gray-900">{loi.party?.landlord_name || "—"}</div>
                <div className="text-xs text-gray-500">{loi.party?.landlord_email || ""}</div>
                <div className="text-xs text-gray-400 mt-1">{loi.party?.landlord_home_town_address || ""}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Tenant</div>
                <div className="text-sm text-gray-900">{loi.party?.tenant_name || "—"}</div>
                <div className="text-xs text-gray-500">{loi.party?.tenant_email || ""}</div>
                <div className="text-xs text-gray-400 mt-1">{loi.party?.tenant_home_town_address || ""}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Created</div>
                <div className="text-sm text-gray-900">
                  {loi.created ? new Date(loi.created).toLocaleString() : "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {loi.updated ? new Date(loi.updated).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            {/* Lease Terms */}
            {loi.leaseTerms && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Lease Terms</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Lease Type</div>
                    <div>{loi.leaseTerms.leaseType || "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Duration</div>
                    <div>{loi.leaseTerms.leaseDuration ? `${loi.leaseTerms.leaseDuration} months` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Start Date</div>
                    <div>{loi.leaseTerms.startDate ? new Date(loi.leaseTerms.startDate).toLocaleDateString() : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Rent Start Date</div>
                    <div>{loi.leaseTerms.rentstartDate ? new Date(loi.leaseTerms.rentstartDate).toLocaleDateString() : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Monthly Rent</div>
                    <div>{loi.leaseTerms.monthlyRent !== undefined ? `$${Number(loi.leaseTerms.monthlyRent)}` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Security Deposit</div>
                    <div>{loi.leaseTerms.securityDeposit !== undefined ? `$${Number(loi.leaseTerms.securityDeposit)}` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Include Renewal Option</div>
                    <div>{loi.leaseTerms.includeRenewalOption ? "Yes" : "No"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Renewal</div>
                    <div>{(loi.leaseTerms.renewalOptionsCount ?? "—")} Options • {(loi.leaseTerms.renewalYears ?? "—")} Years</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Prepaid Rent</div>
                    <div>{loi.leaseTerms.prepaidRent !== undefined ? `$${loi.leaseTerms.prepaidRent}` : "—"}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Rent Escalation (Months)</div>
                    <div>{loi.leaseTerms.RentEscalation ?? "—"}</div>
                  </div>

                   <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs text-gray-500">Rent Escalation Percentage</div>
                    <div>{loi.leaseTerms.rentEscalationPercent ?? "—"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Property Details */}
            {loi.propertyDetails && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Property Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Type</div><div>{loi.propertyDetails.propertyType || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Size</div><div>{loi.propertyDetails.propertySize ? `${loi.propertyDetails.propertySize} Sq ft` : "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Intended Use</div><div>{loi.propertyDetails.intendedUse || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Has Extra Space</div><div>{yesNo(loi.propertyDetails.hasExtraSpace)}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Patio</div><div>{loi.propertyDetails.patio ?? "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Exclusive Use</div><div>{yesNo(loi.propertyDetails.exclusiveUse)}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Amenities</div><div>{asArray(loi.propertyDetails.amenities).join(", ") || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Utilities</div><div>{loi.propertyDetails.utilities?.join(", ") || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Delivery Condition</div><div>{loi.propertyDetails.deliveryCondition || "—"}</div></div>
                </div>

                {/* Maintenance Matrix */}
                {loi.propertyDetails.maintenance && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-900 mb-2">Maintenance Responsibilities</div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-xs table-fixed">
                        <colgroup>
                          <col className="w-1/2" />
                          <col className="w-1/4" />
                          <col className="w-1/4" />
                        </colgroup>
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 text-left">Area</th>
                            <th className="p-2 text-center">Landlord</th>
                            <th className="p-2 text-center">Tenant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(loi.propertyDetails.maintenance).map(([k, v]) => (
                            <tr key={k}>
                              <td className="p-2 capitalize">
                                {k.replace(/([A-Z])/g, " $1").replace(/^hvac$/i, "HVAC")}
                              </td>
                              <td className="p-2 text-center">{(v as MaintenanceSide)?.landlord ? "✔" : "—"}</td>
                              <td className="p-2 text-center">{(v as MaintenanceSide)?.tenant ? "✔" : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Details */}
            {loi.additionalDetails && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">Additional Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Tenant Improvement</div><div>{loi.additionalDetails.tenantImprovement || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Tenant Improvement Provided?</div><div>{loi.additionalDetails.tenantImprovement_check ? "Yes" : "No"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Improvement Allowance Enabled</div><div>{yesNo(loi.additionalDetails.improvementAllowanceEnabled)}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Improvement Allowance Amount</div><div>{loi.additionalDetails.improvementAllowanceAmount !== undefined ? `${loi.additionalDetails.improvementAllowanceAmount}` : "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Lease to Purchase</div><div>{yesNo(loi.additionalDetails.leaseToPurchase)}</div></div>
                  
                                    <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Lease to Purchase Duration</div><div>{loi.additionalDetails.leaseToPurchaseDuration}</div></div>

                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Special Conditions</div><div>{loi.additionalDetails.specialConditions || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Miscellaneous Items</div><div>{loi.additionalDetails.Miscellaneous_items?.join(", ") || "—"}</div></div>
                  <div className="bg-gray-50 rounded p-3"><div className="text-xs text-gray-500">Contingencies</div><div>{loi.additionalDetails.contingencies || "—"}</div></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
