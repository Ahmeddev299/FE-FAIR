// pages/dashboard/pages/loi/view/[id].tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { ArrowLeft, Edit3, Download as DownloadIcon, MessageSquareMore } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/redux/store";

// LOI data
import { getLOIDetailsById } from "@/services/loi/asyncThunk";

// REAL clause actions (reuse your lease thunks)
import {
  acceptClauseSuggestionAsync,                 // { clauseId, clause_key, details }
  updateClauseCurrentVersionAsync,             // { clauseId, clause_key, details, action: "manual_edit" } (action added in thunk)
} from "@/services/lease/asyncThunk";

import { commentOnClauseAsync } from "@/services/clause/asyncThunk";

// Export
import ls from "localstorage-slim";
import Toast from "@/components/Toast";
import { exportLoiToDocx } from "@/utils/exportDocx";
import axios from "axios";
import Config from "@/config/index";

// Modals
import ClauseDetailsModel from "@/components/models/clauseDetailsModel";

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
  _id?: string;                            // document id for the clauses bundle
  clause_name?: string;
  loi_id?: string;
  lease_doc_id?: string | null;
  history?: Record<string, ClauseHistoryEntry>;
  created_at?: string;
  updated_at?: string;
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
  clauseDocId?: string;                    // <- we’ll use this to call APIs
};

// ---------- helpers ----------
const pill = (v?: string) => {
  const s = (v || "").toLowerCase();
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const map: Record<string, string> = {
    pending: `${base} bg-blue-100 text-blue-800`,
    "in progress": `${base} bg-indigo-100 text-indigo-800`,
    approved: `${base} bg-emerald-100 text-emerald-700`,
    "in review": `${base} bg-amber-100 text-amber-800`,
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
    const conf =
      typeof v.ai_confidence_score === "number" ? Math.round(v.ai_confidence_score * 100) : null;
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

const shapeLOI = (raw: any): ShapedLoi | null => {
  if (!raw) return null;
  const data = raw?.data ?? raw;

  // Pull the clause document id safely from any of the places you’ve shown
  const clauseDocId: string | undefined =
    data?.Clauses_id || data?.Clauses?._id || data?.clauses?._id;

  const clausesBlock: ClausesBlock | undefined = data?.Clauses ?? data?.clauses;
  const shaped = shapeClauses(clausesBlock);

  return {
    id: String(data?.id ?? data?._id ?? ""),
    title: String(data?.title ?? "Untitled LOI"),
    address: [
      data?.property_address_S1,
      data?.property_address_S2,
      data?.property_city,
      data?.property_state,
      data?.property_zip,
    ]
      .filter(Boolean)
      .join(", "),
    status: String(data?.submit_status ?? data?.status ?? "—"),
    addFileNumber: data?.addFileNumber,
    created: data?.created_at ?? null,
    updated: data?.updated_at ?? null,
    url: data?.url,
    shapedClauses: shaped?.list,
    rawClausesMap: shaped?.map,
    clauseDocId,
  };
};

// Export helpers
export type LoiServerData = Record<string, unknown>;
export function normalizeLoiResponse(response: unknown): LoiServerData {
  const maybe = response as { success?: boolean; status?: number; message?: string; data?: LoiServerData } | undefined;
  const normalized = maybe?.data ?? (response as LoiServerData);
  if (!normalized || typeof normalized !== "object") throw new Error("Malformed LOI data from server");
  return normalized;
}

export default function SingleLoiPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: queryId } = router.query as { id?: string | string[] };

  const { currentLOI, isLoading, loiError } = useAppSelector((s: RootState) => s.loi);
  const loi = useMemo(() => shapeLOI(currentLOI), [currentLOI]);
  const clauseDocId = loi?.clauseDocId; // unified source

  // load LOI
  useEffect(() => {
    const id = Array.isArray(queryId) ? queryId[0] : queryId;
    if (id) dispatch(getLOIDetailsById(String(id)));
  }, [dispatch, queryId]);

  // download/export
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadingRef = useRef(false);
  const isMountedRef = useRef(true);
  useEffect(() => () => void (isMountedRef.current = false), []);

  const handleDownload = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloading(true);
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");
      const resp = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_template_data`,
        currentLOI,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const maybe = resp as { success?: boolean; message?: string } | undefined;
      if (maybe?.success === false) throw new Error(maybe.message || "Failed to fetch LOI");
      if (maybe?.message) Toast.fire({ icon: "success", title: maybe.message });
      const data: LoiServerData = normalizeLoiResponse(resp);
      await exportLoiToDocx(data);
      if (isMountedRef.current) Toast.fire({ icon: "success", title: "LOI exported successfully" });
    } catch (err: any) {
      Toast.fire({ icon: "warning", title: err?.message || "Something went wrong" });
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

  // ====== Action handlers (REAL APIs) ======
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
      acceptClauseSuggestionAsync({
        clauseId: clauseDocId,
        clause_key: clauseName,
        details: aiText ?? "",
      })
    ).unwrap();

    await refreshLoi();
    Toast.fire({ icon: "success", title: "AI suggestion accepted" });
  };

  const saveCurrentVersion = async (clauseName: string, newText: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(
      updateClauseCurrentVersionAsync({
        clauseId: clauseDocId,
        clause_key: clauseName,
        details: newText,
      })
    ).unwrap();

    await refreshLoi();
    Toast.fire({ icon: "success", title: "Clause updated" });
  };

  const addComment = async (clauseName: string, text: string) => {
    if (!clauseDocId) {
      Toast.fire({ icon: "warning", title: "Missing clauseDocId" });
      return;
    }
    await dispatch(
      commentOnClauseAsync({
        clauseDocId,
        clause_key: clauseName,
        comment: text,
      })
    ).unwrap();

    await refreshLoi();
    Toast.fire({ icon: "success", title: "Comment added" });
  };

  const hasClauses = !!(loi?.shapedClauses && loi.shapedClauses.length > 0);

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
                  <span className={`hidden sm:inline ${hasClauses ? "" : "blur-[1px]"}`}>
                    {isDownloading ? "Downloading…" : "Download"}
                  </span>
                </button>
              </div>
            </div>

            {/* Clauses */}
            {hasClauses ? (
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
              <div className="text-sm text-gray-500">No clauses available for this LOI.</div>
            )}
          </div>
        )}
      </div>

      {/* Details modal with REAL handlers incl. manual edit/save */}
      {detailsOpen && detailsClause && (
        <ClauseDetailsModel
          onClose={() => setDetailsOpen(false)}
          clause={{
            id: detailsClause.id,
            name: detailsClause.name,
            title: detailsClause.title,
            status: detailsClause.status as any,
            risk: detailsClause.risk as any,
            originalText: detailsClause.originalText,
            aiSuggestion: detailsClause.aiSuggestion,
            currentVersion: detailsClause.currentVersion,
            lastEdited: undefined,
            editor: undefined,
          }}
          history={detailsHistory}
          // Called when user clicks "Approve" in the modal
          onApprove={async () => {
            await acceptAI(detailsClause.name, detailsClause.aiSuggestion || detailsClause.currentVersion);
            setDetailsOpen(false);
          }}
          onReject={() => {
            setDetailsOpen(false);
            Toast.fire({ icon: "info", title: "Marked for further review" });
          }}
          // Comment from the modal
          onAddComment={async (text) => {
            await addComment(detailsClause.name, text);
            setDetailsOpen(false);
            return { text, created_at: new Date().toISOString() } as ClauseHistoryComment;
          }}
          
          onSaveCurrentVersion={async (newText: string) => {
            await saveCurrentVersion(detailsClause.name, newText);
            // Update local modal copy so UI reflects immediately
            detailsClause.currentVersion = newText;
            detailsClause.originalText = newText;
            return true;
          }}
        />
      )}
    </DashboardLayout>
  );
}
