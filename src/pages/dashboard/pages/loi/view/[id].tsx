// pages/dashboard/pages/loi/view/[id].tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, Edit3, Download as DownloadIcon, MessageSquareMore } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";

import { getLOIDetailsById } from "@/services/loi/asyncThunk";
import {
  approveLoiClauseApi,
  rejectLoiClauseApi,
  updateClauseCurrentVersionAsync,
} from "@/services/lease/asyncThunk";
import { commentOnClauseAsync } from "@/services/clause/asyncThunk";

import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import { exportLoiToDocx } from "@/utils/exportDocx";
import axios from "axios";
import Config from "@/config/index";

import ClauseDetailsModel from "@/components/models/clauseDetailsModel";

// ---------- local types ----------
type ClauseHistoryComment = { text: string; author?: string; created_at?: string };
type ClauseHistoryEntry = {
  status?: string;
  clause_details?: string;
  current_version?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: ClauseHistoryComment[];
  risk?: string;
  risk_line?: string;
  Recommendation?: string;
  Analysis?: string;
  accepted_ai?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ClausesBlock = {
  _id?: string;
  clause_name?: string;
  loi_id?: string;
  lease_doc_id?: string | null;
  history?: Record<string, ClauseHistoryEntry>;
  created_at?: string;
  updated_at?: string;
};

// Overview types from your payload sample
type PartyInfo = {
  landlord_name?: string;
  landlord_email?: string;
  tenant_name?: string;
  tenant_email?: string;
  tenant_state?: string;
  landlord_state?: string;
  tenant_address_S1?: string;
  tenant_address_S2?: string;
  landlord_address_S1?: string;
  landlord_address_S2?: string;
  tenant_city?: string;
  landlord_city?: string;
  tenant_zip?: string;
  landlord_zip?: string;
};
type LeaseTerms = {
  monthlyRent?: number;
  renewalYears?: string | number | null;
  renewalOptionsCount?: string | number | null;
  includeRenewalOption?: boolean;
  prepaidRent?: number;
  percentageLeasePercent?: string | number | null;
  securityDeposit?: number;
  leaseType?: string;
  leaseDuration?: number;
  RentEscalation?: number;
  startDate?: string;
  rentstartDate?: string;
  escalationBasis?: string;
  rentEscalationType?: string;
  rentEscalationPercent?: number | null;
  rentStartMode?: string;
};
type MaintenanceEntry = { landlord?: boolean; tenant?: boolean };
type PropertyDetails = {
  propertySize?: number;
  hasExtraSpace?: boolean;
  patio?: string | number | boolean;
  patioSize?: number;
  exclusiveUse?: string | boolean;
  intendedUse?: string;
  propertyType?: string;
  amenities?: string | string[];
  utilities?: string[];
  maintenance?: Record<string, MaintenanceEntry>;
  deliveryCondition?: string;
};
type AdditionalDetails = {
  Miscellaneous_items?: string[];
  tenantImprovement_check?: boolean;
  tenantImprovement?: number | string;
  improvementAllowanceAmount?: number;
  improvementAllowanceEnabled?: boolean;
  leaseToPurchase?: boolean;
  specialConditions?: string;
  contingencies?: string[];
  leaseToPurchaseDuration?: number;
};

type ShapedClause = {
  id: string | number;
  name: string;
  status: string;
  risk: string;
  aiSuggestion?: string;
  currentVersion: string;
  commentsUnresolved?: number;
  confidencePct?: number | null;
};

type ShapedLoi = {
  id: string;
  title: string;
  address: string;
  status: string;
  addFileNumber?: string | number;
  created?: string | null;
  updated?: string | null;
  url?: string;
  shapedClauses?: ShapedClause[];
  rawClausesMap?: Record<string, ClauseHistoryEntry>;
  clauseDocId?: string;

  // overview extras
  property_address_S1?: string;
  property_address_S2?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;

  partyInfo?: PartyInfo;
  leaseTerms?: LeaseTerms;
  propertyDetails?: PropertyDetails;
  additionalDetails?: AdditionalDetails;
};

// server DTO
type LoiDTO = {
  id?: string | number;
  _id?: string;
  title?: string;
  submit_status?: string;
  status?: string;
  addFileNumber?: string | number;
  created_at?: string | null;
  updated_at?: string | null;
  url?: string;
  property_address_S1?: string;
  property_address_S2?: string;
  property_city?: string;
  property_state?: string;
  property_zip?: string;
  partyInfo?: PartyInfo;
  leaseTerms?: LeaseTerms;
  propertyDetails?: PropertyDetails;
  additionalDetails?: AdditionalDetails;
  Clauses_id?: string;
  Clauses?: ClausesBlock;
  clauses?: ClausesBlock;
};

export type LoiServerData = Record<string, unknown>;

type RiskLevel = "Low" | "Medium" | "High";
const toRisk = (raw?: string): RiskLevel => {
  const s = (raw || "").trim().toLowerCase();
  if (s === "low") return "Low";
  if (s === "medium" || s === "med") return "Medium";
  if (s === "high") return "High";
  return "Medium";
};
type ExtendedClause = {
  // ...
  status:
  | "AI Suggested"
  | "Edited"
  | "Approved"
  | "Needs Review"
  | "Pending"
  | "Suggested"
  | "Rejected"; // add this
};

type UiStatus = Exclude<ExtendedClause["status"], "Rejected">;
// or write it out explicitly:
// type UiStatus = "AI Suggested" | "Edited" | "Approved" | "Needs Review" | "Pending" | "Suggested";

export const toUiStatus = (raw?: string): UiStatus => {
  const s = (raw ?? "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  switch (s) {
    case "ai suggested":
      return "AI Suggested";
    case "edited":
    case "manual":
    case "manual edit":
      return "Edited";
    case "approved":
    case "accepted":
      return "Approved";
    case "needs review":
    case "in review":
    case "rejected":          // <- normalized to a UI-allowed status
      return "Needs Review";
    case "suggested":
    case "suggestion":
      return "Suggested";
    default:
      return "Pending";
  }
};
// ---------- helpers ----------
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const pill = (v?: string) => {
  const s = (v || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    pending: `${base} bg-blue-100 text-blue-800`,
    "in progress": `${base} bg-indigo-100 text-indigo-800`,
    approved: `${base} bg-emerald-100 text-emerald-700`,
    "in review": `${base} bg-amber-100 text-amber-800`,
    "rejected": `${base} bg-red-100 text-amber-800`,

    draft: `${base} bg-gray-100 text-gray-700`,
    terminated: `${base} bg-rose-100 text-rose-700`,
  };
  return <span className={map[s] || `${base} bg-gray-100 text-gray-700`}>{v || "—"}</span>;
};

const truncate = (s?: string, n = 160) => (s ? (s.length > n ? s.slice(0, n) + "…" : s) : "—");

const shapeClauses = (block?: ClausesBlock) => {
  const history = block?.history;
  if (!history) return undefined;

  const list: ShapedClause[] = Object.entries(history).map(([key, v], idx) => {
    const conf = typeof v.ai_confidence_score === "number" ? Math.round(v.ai_confidence_score * 100) : null;
    const comments = Array.isArray(v.comment) ? v.comment.length : 0;
    return {
      id: idx,
      name: key,
      status: v.status || "Pending",
      risk: v.risk || "—",
      aiSuggestion: v.ai_suggested_clause_details || "",
      currentVersion: v.current_version || v.clause_details || "",
      commentsUnresolved: comments,
      confidencePct: conf,
    };
  });

  return { list, map: history as Record<string, ClauseHistoryEntry> };
};

const shapeLOI = (raw: unknown): ShapedLoi | null => {
  if (!raw) return null;

  // support { data: ... } or the object itself
  const container = isRecord(raw) && "data" in raw ? (raw as { data: unknown }).data : raw;
  if (!isRecord(container)) return null;

  const data = container as LoiDTO;

  const clauseDocId: string | undefined =
    data?.Clauses_id || data?.Clauses?._id || data?.clauses?._id;

  const clausesBlock: ClausesBlock | undefined = data?.Clauses ?? data?.clauses;
  const shaped = shapeClauses(clausesBlock);

  const address = [
    data?.property_address_S1,
    data?.property_address_S2,
    data?.property_city,
    data?.property_state,
    data?.property_zip,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(data?.id ?? data?._id ?? ""),
    title: String(data?.title ?? "Untitled LOI"),
    address,
    status: String(data?.submit_status ?? data?.status ?? "—"),
    addFileNumber: data?.addFileNumber,
    created: data?.created_at ?? null,
    updated: data?.updated_at ?? null,
    url: data?.url,
    shapedClauses: shaped?.list,
    rawClausesMap: shaped?.map,
    clauseDocId,

    // copy raw fields used by overview
    property_address_S1: data.property_address_S1,
    property_address_S2: data.property_address_S2,
    property_city: data.property_city,
    property_state: data.property_state,
    property_zip: data.property_zip,

    partyInfo: data.partyInfo,
    leaseTerms: data.leaseTerms,
    propertyDetails: data.propertyDetails,
    additionalDetails: data.additionalDetails,
  };
};

export function normalizeLoiResponse(response: unknown): LoiServerData {
  const maybe = isRecord(response) ? (response as { data?: LoiServerData }) : undefined;
  const normalized = (maybe?.data ?? response) as unknown;
  if (!isRecord(normalized)) throw new Error("Malformed LOI data from server");
  return normalized;
}

const errorMessage = (e: unknown): string => {
  if (typeof e === "string") return e;
  if (isRecord(e) && "message" in e && typeof (e as { message?: unknown }).message === "string") {
    return (e as { message?: string }).message ?? "Unknown error";
  }
  return "Something went wrong";
};

// ---------- component ----------
export default function SingleLoiPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: queryId } = router.query as { id?: string | string[] };

  const { currentLOI, isLoading, loiError } = useAppSelector((s: RootState) => s.loi);
  const loi = useMemo(() => shapeLOI(currentLOI), [currentLOI]);
  const [docid, setdocid] = useState()
  const clauseDocId = loi?.clauseDocId;

  useEffect(() => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) void dispatch(getLOIDetailsById(String(id)));
    setdocid(id)
  }, [dispatch, queryId]);

  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDownload = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloading(true);
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const resp = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_template_data`,

        {
          ...currentLOI,
          doc_id: docid

        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      const maybe = resp as { data?: { success?: boolean; message?: string } };
      if (maybe?.data?.success === false) throw new Error(maybe.data.message || "Failed to fetch LOI");

      const msg = maybe?.data?.message;
      if (msg) Toast.fire({ icon: "success", title: msg });

      const data = normalizeLoiResponse(resp);
      const isTemp = resp.data?.data?.temp === true;
      console.log("isTem", isTemp)
      await exportLoiToDocx(data, undefined, isTemp);
      if (isMountedRef.current) Toast.fire({ icon: "success", title: "LOI exported successfully" });
    } catch (err: unknown) {
      Toast.fire({ icon: "warning", title: errorMessage(err) });
      router.push("/auth/verify-otp");
    } finally {
      downloadingRef.current = false;
      setIsDownloading(false);
    }
  };

  // ====== Clause details modal state ======
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsClause, setDetailsClause] = useState<{
    id: string | number;
    name: string;
    title: string;
    status: string;
    risk: string;
    originalText: string;
    aiSuggestion: string;
    currentVersion: string;
  } | null>(null);
  const [detailsHistory, setDetailsHistory] = useState<ClauseHistoryEntry | undefined>(undefined);

  // ====== Action handlers ======
  const refreshLoi = async () => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) await dispatch(getLOIDetailsById(String(id)));
  };

  const acceptAI = async (clauseName: string, aiText?: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(
      approveLoiClauseApi({ clauseId: clauseDocId, clause_key: clauseName, details: aiText ?? "" })
    ).unwrap();
    await refreshLoi();
    Toast.fire({ icon: "success", title: "Approve LOI" });
  };

  const rejectAI = async (clauseName: string, aiText?: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(
      rejectLoiClauseApi({ clauseId: clauseDocId, clause_key: clauseName, details: aiText ?? "" })
    ).unwrap();
    await refreshLoi();
    Toast.fire({ icon: "success", title: "Reject LOI" });
  };

  const saveCurrentVersion = async (clauseName: string, newText: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(
      updateClauseCurrentVersionAsync({ clauseId: clauseDocId, clause_key: clauseName, details: newText })
    ).unwrap();
    await refreshLoi();
    Toast.fire({ icon: "success", title: "Clause updated" });
  };

  const addComment = async (clauseName: string, text: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(commentOnClauseAsync({ clauseDocId, clause_key: clauseName, comment: text })).unwrap();
    await refreshLoi();
    Toast.fire({ icon: "success", title: "Comment added" });
  };

  const hasClauses = !!(loi?.shapedClauses && loi.shapedClauses.length > 0);

  // Helpers for overview formatting
  const formatMoney = (n?: number) =>
    typeof n === "number" ? n.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "—";

  const amenitiesText = (a?: string | string[]) =>
    Array.isArray(a) ? a.join(", ") : a || "—";

  return (
    <DashboardLayout>
      {(isLoading || isDownloading) && <LoadingOverlay visible />}

      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {!isLoading && !loiError && loi && (
          <div className={`bg-white rounded-xl p-6 space-y-6 ${isDownloading ? "opacity-90 pointer-events-none" : ""}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{loi.title}</h1>
                <div className="mt-1 text-sm text-gray-500">{loi.address || "—"}</div>
                <div className="mt-1 text-xs text-gray-500">File #: {loi.addFileNumber ?? "—"}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {pill(loi.status)}
                <button
                  onClick={() => router.push(`/dashboard/pages/loi/edit/${loi.id}`)}
                  title="Edit LOI"
                  className="inline-flex h-10 items-center w-[130px] gap-5 rounded-xl px-3 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit LOI</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  title="Download LOI"
                  className="inline-flex h-10 items-center gap-2 w-[130px] rounded-xl px-3 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:bg-emerald-600/60 disabled:cursor-not-allowed"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span className={`hidden sm:inline ${hasClauses ? "" : ""}`}>
                    {isDownloading ? "Downloading…" : "Download"}
                  </span>
                </button>
              </div>

            </div>

            {/* Clauses vs. Overview */}
            {hasClauses ? (
              /* ===== Clauses list ===== */
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {loi.shapedClauses!.map((c) => (
                  <div key={c.id} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center">
                    {/* Clause + snippet */}
                    <div className="sm:w-[32%]">
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-sm text-gray-500">{truncate(c.currentVersion)}</div>
                    </div>

                    {/* Status */}
                    <div className="sm:w-[14%]">{pill(c.status)}</div>

                    {/* Risk / Confidence */}
                    <div className="sm:w-[20%]">
                      <div className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 mr-2">
                        {c.risk || "—"}
                      </div>
                      <span className="text-xs text-gray-500">
                        {c.confidencePct != null ? `${c.confidencePct}% conf.` : "—"}
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="sm:w-[15%]">
                      <span className="text-sm text-gray-600">
                        {c.commentsUnresolved ? `${c.commentsUnresolved} comment(s)` : "No comments"}
                      </span>
                    </div>

                    <div className="sm:w-[19%] flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setDetailsClause({
                            id: c.id,
                            name: c.name,
                            title: c.name,
                            status: c.status,
                            risk: c.risk,
                            originalText: c.currentVersion,
                            aiSuggestion: c.aiSuggestion || "",
                            currentVersion: c.currentVersion,
                          });
                          setDetailsHistory(loi.rawClausesMap?.[c.name]);
                          setDetailsOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setDetailsClause({
                            id: c.id,
                            name: c.name,
                            title: c.name,
                            status: c.status,
                            risk: c.risk,
                            originalText: c.currentVersion,
                            aiSuggestion: c.aiSuggestion || "",
                            currentVersion: c.currentVersion,
                          });
                          setDetailsHistory(loi.rawClausesMap?.[c.name]);
                          setDetailsOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50 inline-flex items-center gap-1"
                      >
                        <MessageSquareMore className="w-3.5 h-3.5" />
                        Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Property Address (Full)</div>
                    <div className="text-sm text-gray-900">{loi.address || "—"}</div>
                    <div className="text-xs text-gray-400 mt-1 flex flex-col">
                      <span>Line 1: {loi.property_address_S1 || "—"}</span>
                      <span>Line 2: {loi.property_address_S2 || "—"}</span>
                      <span>
                        City/State/Zip:{" "}
                        {[loi.property_city, loi.property_state, loi.property_zip].filter(Boolean).join(", ") || "—"}
                      </span>
                    </div>
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
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="text-sm text-gray-900">{loi.status || "—"}</div>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Landlord</div>
                    <div className="text-sm text-gray-900">{loi.partyInfo?.landlord_name || "—"}</div>
                    <div className="text-xs text-gray-500">{loi.partyInfo?.landlord_email || ""}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      <div>Address 1: {loi.partyInfo?.landlord_address_S1 || "—"}</div>
                      <div>Address 2: {loi.partyInfo?.landlord_address_S2 || "—"}</div>
                      <div>
                        City/State/Zip:{" "}
                        {[loi.partyInfo?.landlord_city, loi.partyInfo?.landlord_state, loi.partyInfo?.landlord_zip]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Tenant</div>
                    <div className="text-sm text-gray-900">{loi.partyInfo?.tenant_name || "—"}</div>
                    <div className="text-xs text-gray-500">{loi.partyInfo?.tenant_email || ""}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      <div>Address 1: {loi.partyInfo?.tenant_address_S1 || "—"}</div>
                      <div>Address 2: {loi.partyInfo?.tenant_address_S2 || "—"}</div>
                      <div>
                        City/State/Zip:{" "}
                        {[loi.partyInfo?.tenant_city, loi.partyInfo?.tenant_state, loi.partyInfo?.tenant_zip]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </div>
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

                      {loi.leaseTerms.leaseType === "Percentage Lease" && (
                        <div className="bg-gray-50 rounded p-3">
                          <div className="text-xs text-gray-500">Percentage Lease</div>
                          <div>{loi.leaseTerms.percentageLeasePercent ?? "—"}</div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div>
                          {typeof loi.leaseTerms.leaseDuration === "number"
                            ? `${loi.leaseTerms.leaseDuration} months`
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Start Date</div>
                        <div>
                          {loi.leaseTerms.startDate
                            ? new Date(loi.leaseTerms.startDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Rent Start Date</div>
                        <div>
                          {loi.leaseTerms.rentstartDate
                            ? new Date(loi.leaseTerms.rentstartDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Monthly Rent</div>
                        <div>{formatMoney(loi.leaseTerms.monthlyRent)}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Security Deposit</div>
                        <div>{formatMoney(loi.leaseTerms.securityDeposit)}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Include Renewal Option</div>
                        <div>
                          {typeof loi.leaseTerms.includeRenewalOption === "boolean"
                            ? loi.leaseTerms.includeRenewalOption
                              ? "Yes"
                              : "No"
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Renewal</div>
                        <div>
                          {(loi.leaseTerms.renewalOptionsCount ?? "—")} Options •{" "}
                          {(loi.leaseTerms.renewalYears ?? "—")} Years
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Prepaid Rent</div>
                        <div>{formatMoney(loi.leaseTerms.prepaidRent)}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Rent Escalation (Months)</div>
                        <div>{loi.leaseTerms.RentEscalation ?? "—"}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Rent Escalation %</div>
                        <div>{loi.leaseTerms.rentEscalationPercent ?? "—"}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Escalation Basis</div>
                        <div>{loi.leaseTerms.escalationBasis || "—"}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Rent Escalation Type</div>
                        <div>{loi.leaseTerms.rentEscalationType || "—"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Property Details */}
                {loi.propertyDetails && (
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Property Details</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Type</div>
                        <div>{loi.propertyDetails.propertyType || "—"}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Size</div>
                        <div>
                          {typeof loi.propertyDetails.propertySize === "number"
                            ? `${loi.propertyDetails.propertySize} Sq ft`
                            : "—"}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Intended Use</div>
                        <div>{loi.propertyDetails.intendedUse || "—"}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Has Extra Space</div>
                        <div>
                          {typeof loi.propertyDetails.hasExtraSpace === "boolean"
                            ? loi.propertyDetails.hasExtraSpace
                              ? "Yes"
                              : "No"
                            : "—"}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Patio</div>
                        <div>{String(loi.propertyDetails.patio ?? "—")}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Exclusive Use</div>
                        <div>{String(loi.propertyDetails.exclusiveUse ?? "—")}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Amenities</div>
                        <div>{amenitiesText(loi.propertyDetails.amenities)}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Utilities</div>
                        <div>{loi.propertyDetails.utilities?.join(", ") || "—"}</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Delivery Condition</div>
                        <div>{loi.propertyDetails.deliveryCondition || "—"}</div>
                      </div>
                    </div>

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
                                  <td className="p-2 text-center">{v.landlord ? "✔" : "—"}</td>
                                  <td className="p-2 text-center">{v.tenant ? "✔" : "—"}</td>
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
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Tenant Improvement</div>
                        <div>{String(loi.additionalDetails.tenantImprovement ?? "—")}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Tenant Improvement Provided?</div>
                        <div>
                          {typeof loi.additionalDetails.tenantImprovement_check === "boolean"
                            ? loi.additionalDetails.tenantImprovement_check
                              ? "Yes"
                              : "No"
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Improvement Allowance Enabled</div>
                        <div>
                          {typeof loi.additionalDetails.improvementAllowanceEnabled === "boolean"
                            ? loi.additionalDetails.improvementAllowanceEnabled
                              ? "Yes"
                              : "No"
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Improvement Allowance Amount</div>
                        <div>
                          {typeof loi.additionalDetails.improvementAllowanceAmount === "number"
                            ? loi.additionalDetails.improvementAllowanceAmount
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Lease to Purchase</div>
                        <div>
                          {typeof loi.additionalDetails.leaseToPurchase === "boolean"
                            ? loi.additionalDetails.leaseToPurchase
                              ? "Yes"
                              : "No"
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Lease to Purchase Duration</div>
                        <div>
                          {typeof loi.additionalDetails.leaseToPurchaseDuration === "number"
                            ? loi.additionalDetails.leaseToPurchaseDuration
                            : "—"}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Special Conditions</div>
                        <div>{loi.additionalDetails.specialConditions || "—"}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Miscellaneous Items</div>
                        <div>{loi.additionalDetails.Miscellaneous_items?.join(", ") || "—"}</div>
                      </div>

                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-500">Contingencies</div>
                        <div>{`${loi.additionalDetails.contingencies} ` || "—"}</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Details modal */}
      {detailsOpen && detailsClause && (
        <ClauseDetailsModel
          onClose={() => setDetailsOpen(false)}
          clause={{
            id: detailsClause.id,
            name: detailsClause.name,
            title: detailsClause.title,
            status: toUiStatus(detailsClause.status),  // <- returns UiStatus (no "Rejected")
            risk: toRisk(detailsClause.risk),
            originalText: detailsClause.originalText,
            aiSuggestion: detailsClause.aiSuggestion,
            currentVersion: detailsClause.currentVersion,
            lastEdited: undefined,
            editor: undefined,
          }}
          history={detailsHistory}
          onApprove={async () => {
            await acceptAI(detailsClause.name, detailsClause.aiSuggestion || detailsClause.currentVersion);
            setDetailsOpen(false);
          }}
          onReject={async () => {
            setDetailsOpen(false);
            await rejectAI(detailsClause.name, detailsClause.aiSuggestion || detailsClause.currentVersion)
          }}
          onAddComment={async (text: string) => {
            await addComment(detailsClause.name, text);
            setDetailsOpen(false);
            return { text, created_at: new Date().toISOString() } as ClauseHistoryComment;
          }}
          onSaveCurrentVersion={async (newText: string) => {
            await saveCurrentVersion(detailsClause.name, newText);
            // update local modal state to reflect immediately
            detailsClause.currentVersion = newText;
            detailsClause.originalText = newText;
            return true;
          }}
        />
      )}
    </DashboardLayout>
  );
}
