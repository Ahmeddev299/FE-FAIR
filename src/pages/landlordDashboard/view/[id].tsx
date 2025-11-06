/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Clock,
  AlertCircle,
  DownloadIcon,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  getLOIDetailsById,
  llCommentClauseAsync,
  llDecideClauseAsync,
  llReadClauseAsync,
  llApproveAllAsync,
} from "@/services/loi/asyncThunk";
import { selectLOI } from "@/redux/slices/loiSlice";
import axios from "axios";
import Config from "@/config/index";
import { normalizeLoiResponse } from "@/pages/dashboard/pages/loi/view/[id]";
import Toast from "@/components/Toast";
import { exportLoiToDocx } from "@/utils/exportDocx";
import ls from "localstorage-slim";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { updateLandlordClauseCurrentVersionAsync } from "@/services/lease/asyncThunk";

/** ---------------- Local fallbacks if your shared types are missing ---------------- */
export type LocalClauseStatus = "approved" | "pending" | "need-review" | "rejected" | undefined;

export interface ClauseView {
  key: string;
  status?: LocalClauseStatus;
  risk?: "Low" | "Medium" | "High" | undefined;
  warning?: string;
  comments?: Array<{ text: string; author?: string; created_at?: string }>;
  text?: string;
  analysis?: string;
  recommendation?: string;
  aiSuggestion?: string;
  confidenceScore?: number;
}

export interface ClauseHistoryItem {
  status_landlord?: LocalClauseStatus;
  status?: LocalClauseStatus;
  risk_landlord?: "Low" | "Medium" | "High";
  risk_line_landlord?: string;
  comment?: Array<{ text: string; created_at?: string }>;
  current_version?: string;
  clause_details?: string;
  Analysis_landlord?: string;
  Recommendation_landlord?: string;
  ai_suggested_clause_details_landlord?: string;
  ai_confidence_score?: number;
}

export interface CurrentLOIShape {
  id?: string | number;
  title?: string;
  partyInfo?: { tenant_name?: string };
  company?: string;
  property_address_S1?: string;
  property_city?: string;
  propertyAddress?: string;
  leaseTerms?: { monthlyRent?: number | string };
  submit_status?: "New" | "In Review" | "Submitted" | "Finalized" | "Rejected" | string;
  Clauses?: {
    history?: Record<string, ClauseHistoryItem>;
  };
}

/** -------------------------------- Component -------------------------------- */
export default function ClauseDetailPanel() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams() as { id?: string | string[]; clause?: string | string[] };

  const [isDownloadingLoi, setIsDownloadingLoi] = useState(false);
  const [isSubmittingLoi, setLoiSubmit] = useState(false)

  const downloadingRef = useRef(false);
  const submittingLoi = useRef(false);

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  const { loiList, currentLOI } = useAppSelector(selectLOI) as {
    loiList?: { my_loi?: CurrentLOIShape[] };
    currentLOI?: CurrentLOIShape;
  };

  const [selectedLOI, setSelectedLOI] = useState<CurrentLOIShape | null>(null);
  const [selectedClauseKey, setSelectedClauseKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [localText, setLocalText] = useState<Record<string, string>>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentingForKey, setCommentingForKey] = useState<string | null>(null);

  // Optimistic UI states
  const [localStatus, setLocalStatus] = useState<Record<string, LocalClauseStatus>>({});
  const [localComments, setLocalComments] = useState<
    Record<string, Array<{ text: string; author?: string; created_at: string }>>
  >({});

  // Extract route params
  const routeLoiId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const routeClauseSlug = Array.isArray(params?.clause) ? params.clause[0] : params?.clause;

  // Utility: slugify
  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const [docid, setdocid] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = Array.isArray(routeLoiId) ? routeLoiId[0] : routeLoiId;
    if (id) void dispatch(getLOIDetailsById(String(id)));
    setdocid(id);
  }, [dispatch, routeLoiId]);

  // 1) Fetch LOI details directly from URL ID (don't wait for list)
  useEffect(() => {
    if (!routeLoiId) return;

    // Fetch LOI details immediately
    dispatch(getLOIDetailsById(routeLoiId));

    // If loiList is available, set selected LOI for display
    const list = loiList?.my_loi ?? [];
    if (list.length) {
      const found = list.find((x) => String(x.id) === String(routeLoiId));
      if (found) {
        setSelectedLOI(found);
      }
    }
  }, [dispatch, routeLoiId, loiList?.my_loi]);

  // 2) Build clauses array (landlord-specific)
  const clauses: ClauseView[] = useMemo(() => {
    const history = currentLOI?.Clauses?.history;
    if (!history) return [];

    return Object.entries(history).map(([key, data]) => {
      const baseStatus: LocalClauseStatus = data.status;
      const overridden = localStatus[key] ?? undefined;

      const serverComments = Array.isArray(data.comment) ? data.comment : [];
      const optimistic = localComments[key] ?? [];
      const mergedComments = [...serverComments, ...optimistic]; // ✅ merge

      return {
        key,
        status: overridden || baseStatus,
        risk: data.risk_landlord,
        warning: data.risk_line_landlord,
        comments: mergedComments,                       // ✅ use merged
        text: data.current_version || data.clause_details,
        analysis: data.Analysis_landlord,
        recommendation: data.Recommendation_landlord,
        aiSuggestion: data.ai_suggested_clause_details_landlord,
        confidenceScore: data.ai_confidence_score,
      };
    });
  }, [currentLOI, localStatus, localComments]);

  const slugMap = useMemo(() => {
    const m = new Map<string, string>();
    clauses.forEach((c) => m.set(slugify(c.key), c.key));
    return m;
  }, [clauses]);

  useEffect(() => {
    if (!routeLoiId || !currentLOI?.Clauses?.history) return;

    if (routeClauseSlug) {
      const keyFromSlug = slugMap.get(routeClauseSlug);
      if (keyFromSlug && keyFromSlug !== selectedClauseKey) {
        setSelectedClauseKey(keyFromSlug);
        dispatch(llReadClauseAsync({ loiId: routeLoiId, clause_key: keyFromSlug }));
      }
    }
  }, [dispatch, routeLoiId, currentLOI?.Clauses?.history, routeClauseSlug, slugMap, selectedClauseKey]);

  // 5) Clause stats
  const clauseStats = useMemo(() => {
    const approved = clauses.filter((c) => c.status === "approved").length;
    const pending = clauses.filter((c) => c.status === "pending").length;
    const needReview = clauses.filter((c) => c.status === "need-review" || c.status === "rejected").length;
    return { approved, pending, needReview };
  }, [clauses]);

  /* -------------------------------- Handlers -------------------------------- */
  const handleOpenClause = (key: string) => {
    setSelectedClauseKey(key);
    if (routeLoiId) {
      dispatch(llReadClauseAsync({ loiId: routeLoiId, clause_key: key }));
    }
  };

  const onApproveClause = useCallback(
    (clauseKey: string) => {
      if (!routeLoiId) return;
      setLocalStatus((prev) => ({ ...prev, [clauseKey]: "approved" }));
      dispatch(llDecideClauseAsync({ loiId: routeLoiId, clause_key: clauseKey, action: "approved" }));
    },
    [dispatch, routeLoiId]
  );

  const onRejectClause = useCallback(
    (clauseKey: string) => {
      if (!routeLoiId) return;
      setLocalStatus((prev) => ({ ...prev, [clauseKey]: "rejected" }));
      dispatch(llDecideClauseAsync({ loiId: routeLoiId, clause_key: clauseKey, action: "rejected" }));
    },
    [dispatch, routeLoiId]
  );

  const onCommentClause = useCallback(
    (clauseKey: string, text: string) => {
      if (!routeLoiId) return;
      setLocalComments(prev => {
        const arr = prev[clauseKey] ? [...prev[clauseKey]] : [];
        arr.unshift({
          text,
          author: (currentLOI as any)?.partyInfo?.landlord_email || undefined,
          created_at: new Date().toISOString(),
        });
        return { ...prev, [clauseKey]: arr };
      });
      dispatch(llCommentClauseAsync({ loiId: routeLoiId, clause_key: clauseKey, text }));
    },
    [dispatch, routeLoiId, currentLOI]
  );

  const selectedClauseData = useMemo<ClauseView | null>(() => {
    if (!selectedClauseKey) return null;
    return clauses.find((c) => c.key === selectedClauseKey) ?? null;
  }, [selectedClauseKey, clauses]);

  const getStatusPillColor = (status: string) => {
    const colors: Record<string, string> = {
      New: "bg-blue-50 text-blue-700",
      "In Review": "bg-yellow-50 text-yellow-700",
      Submitted: "bg-yellow-50 text-yellow-700",
      Finalized: "bg-emerald-50 text-emerald-700",
      Rejected: "bg-rose-50 text-rose-700",
    };
    return colors[status] || "bg-gray-50 text-gray-700";
  };

  const getClauseStatusIcon = (status?: string) => {
    if (status === "approved") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === "rejected") return <XCircle className="w-4 h-4 text-rose-500" />;
    if (status === "need-review") return <AlertCircle className="w-4 h-4 text-orange-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

   const RiskBadge = ({ risk }: { risk?: "Low" | "Medium" | "High" }) => {
    const styles: Record<string, string> = {
      Low: "bg-[#DCFCE7] text-emerald-700",
      Medium: "bg-[#FEF9C3] text-yellow-700",
      High: "bg-[#FEE2E2] text-rose-700",
    };
    const cls = styles[risk || ""] || "bg-gray-50 text-gray-700";
    const label = risk ? `${risk} Risk` : "—";
    return <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
  };


  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

  const errorMessage = (e: unknown): string => {
    if (typeof e === "string") return e;
    if (isRecord(e) && "message" in e && typeof (e as { message?: unknown }).message === "string") {
      return (e as { message?: string }).message ?? "Unknown error";
    }
    return "Something went wrong";
  };

  const handleSubmitLOI = async () => {
    if (submittingLoi.current) return;
    submittingLoi.current = true;
    setLoiSubmit(true)
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const resp = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/submit_clauses`,
        { doc_id: docid },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      const maybe = resp as { data?: { success?: boolean; message?: string } };
      if (maybe?.data?.success === false) throw new Error(maybe.data.message || "Failed to submit LOI");

      const msg = maybe?.data?.message;
      if (msg) Toast.fire({ icon: "success", title: msg });

      if (isMountedRef.current) Toast.fire({ icon: "success", title: "LOI submitted successfully" });
    } catch (err: unknown) {
      console.log(err)
    } finally {
      submittingLoi.current = false;
      setLoiSubmit(false);
    }

  };

  const handleDownload = async () => {
    if (downloadingRef.current) return;
    downloadingRef.current = true;
    setIsDownloadingLoi(true);
    try {
      const token = ls.get("access_token", { decrypt: true });
      if (!token) throw new Error("Authentication token not found");

      const resp = await axios.post(
        `${Config.API_ENDPOINT}/dashboard/download_template_data`,
        { ...currentLOI, doc_id: docid },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      const maybe = resp as { data?: { success?: boolean; message?: string; data?: { temp?: boolean } } };
      if (maybe?.data?.success === false) throw new Error(maybe.data.message || "Failed to fetch LOI");

      const msg = maybe?.data?.message;
      if (msg) Toast.fire({ icon: "success", title: msg });

      const data = normalizeLoiResponse(resp);
      const isTemp = true
      await exportLoiToDocx(data, undefined, isTemp);
      if (isMountedRef.current) Toast.fire({ icon: "success", title: "LOI exported successfully" });
    } catch (err: unknown) {
      Toast.fire({ icon: "warning", title: errorMessage(err) });
    } finally {
      downloadingRef.current = false;
      setIsDownloadingLoi(false);
    }
  };

    const onSaveClauseText = async () => {
    if (!selectedClauseKey) return;
    const clauseId = routeLoiId;
    if (!clauseId) {
      Toast.fire({ icon: "error", title: "Clause document id missing" });
      return;
    }

    setLocalText(prev => ({ ...prev, [selectedClauseKey]: draftText }));
    setIsEditing(false);
    setDirty(false);

    try {
      await dispatch(
        updateLandlordClauseCurrentVersionAsync({
          clauseId,
          clause_key: selectedClauseKey,
          details: draftText,
        })
      ).unwrap();

      Toast.fire({ icon: "success", title: "Clause updated" });

      if (routeLoiId) {
        dispatch(llReadClauseAsync({ loiId: routeLoiId, clause_key: selectedClauseKey }));
      }
    } catch {
      setLocalText(prev => {
        const clone = { ...prev };
        delete clone[selectedClauseKey];
        return clone;
      });
      setIsEditing(true);
    }
  };

  const displayLOI: CurrentLOIShape | null = selectedLOI ?? currentLOI ?? null;

  useEffect(() => {
    if (!selectedClauseKey || !selectedClauseData) return;

    // Only auto-fill when not editing or when user hasn't typed yet.
    if (!isEditing || !dirty) {
      const latest =
        localText[selectedClauseData.key] ??
        selectedClauseData.text ??
        "";
      setDraftText(latest);
    }
  }, [selectedClauseKey, selectedClauseData?.text, isEditing, dirty, localText, selectedClauseData, selectedClauseData?.key]);

  const openCommentModal = (clauseKey: string) => {
    setCommentingForKey(clauseKey);
    setCommentText("");
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setCommentingForKey(null);
    setCommentText("");
  };

  const submitComment = () => {
    const text = commentText.trim();
    if (!text || !commentingForKey) return;
    onCommentClause(commentingForKey, text);
    closeCommentModal();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-base font-semibold text-gray-900 mb-1">Review LOIs</h1>
                <p className="text-sm text-gray-600">Reviewing: {displayLOI?.title || "Loading..."}</p>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tenant:</span>
                  <span className="font-medium text-gray-900">
                    {displayLOI?.partyInfo?.tenant_name || displayLOI?.company || "—"}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium text-gray-900">
                    {displayLOI?.property_address_S1 && displayLOI.property_city
                      ? `${displayLOI.property_address_S1}, ${displayLOI.property_city}`
                      : displayLOI?.propertyAddress || "—"}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Rent:</span>
                  <span className="font-medium text-gray-900">
                    ${displayLOI?.leaseTerms?.monthlyRent ?? "-"}/mo
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium ${getStatusPillColor(
                    displayLOI?.submit_status || "In Review"
                  )}`}
                >
                  {displayLOI?.submit_status || "In Review"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-3 flex items-center gap-3">
            {/* Back to Dashboard */}
            <button
              onClick={() => {
                setSelectedLOI(null);
                setSelectedClauseKey(null);
                setLocalStatus({});
                setLocalComments({});
                router.push("/landlordDashboard/pages/mainpage");
              }}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            {/* subtle divider */}
            <span className="h-5 w-px bg-gray-200" />

            {/* Right-aligned actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Download (outlined, neutral) */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloadingLoi || downloadingRef.current}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm"
              >
                Download
                <DownloadIcon className="w-4 h-4" />
                {isDownloadingLoi && (<LoadingOverlay visible />)}
              </button>


              {/* Approve All (outlined, blue) */}
              <button
                onClick={async () => {
                  if (!routeLoiId) return;
                  await dispatch(llApproveAllAsync(routeLoiId));
                  if (currentLOI?.Clauses?.history) {
                    const next: Record<string, LocalClauseStatus> = {};
                    Object.keys(currentLOI.Clauses.history).forEach((k) => (next[k] = "approved"));
                    setLocalStatus((prev) => ({ ...prev, ...next }));
                  }
                }}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve All
              </button>

              {/* Finalize LOI (solid, primary) */}
              <button
                onClick={handleSubmitLOI}
                disabled={isSubmittingLoi || submittingLoi.current}
                className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
              >
                Finalize LOI
                {isSubmittingLoi && (<LoadingOverlay visible fullscreen />)}

              </button>
            </div>
          </div>

        </div>

        {/* Clauses Section */}
        <div className="w-full mx-auto">
          <div className="bg-white border border-white p-6">
            {/* Clauses Header */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Clauses</h2>
                <p className="text-sm text-gray-600">
                  {clauseStats.approved} approved, {clauseStats.pending} pending, {clauseStats.needReview} need review
                </p>
              </div>

              {/* Clause Grid */}
              <div className="grid grid-cols-2 gap-4">
                {clauses.map((cl) => (
                  <button
                    key={cl.key}
                    onClick={() => handleOpenClause(cl.key)}
                    className={`text-left p-4 rounded-lg transition-all ${selectedClauseKey === cl.key
                      ? "bg-[#EFF6FF] border-2 border-[#EFF6FF]"
                      : "bg-white border border-[#E2E8F0] hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-sm text-gray-900 flex-1 pr-2">{cl.key}</h3>
                      {getClauseStatusIcon(cl.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <RiskBadge risk={cl.risk} />
                    </div>

                    {cl.comments && cl.comments.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{cl.comments.length}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Clause Detail Section - Shows below grid when clause selected */}
            {selectedClauseData && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                {/* Clause Title & Actions */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedClauseData.key}</h3>

                  <div className="flex items-center gap-2">
                    {/* Risk Badge */}
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={selectedClauseData.risk} />
                    </div>

                    {/* Compliant Badge (UI placeholder) */}
                    <button className="flex items-center gap-2 text-xs px-3 py-1.5 text-[#2D8EEF] rounded-md font-medium" disabled>
                      <CheckCircle2 className="w-4 h-4" />
                      Compliant
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => onRejectClause(selectedClauseData.key)}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 text-[#E55858] bg-white rounded-md border border-gray-200 font-medium hover:bg-rose-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => onApproveClause(selectedClauseData.key)}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 text-[#2D8EEF] bg-white border  rounded-md font-medium hover:bg-blue-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => openCommentModal(selectedClauseData.key)}
                      className="flex items-center gap-2 text-sm px-3 py-1.5 text-gray-700 bg-white rounded-md border border-gray-300 font-medium hover:bg-gray-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Comment
                    </button>

                  </div>
                </div>

                {/* Clause Text */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Clause Text</h4>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>

                  {!isEditing ? (
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-7 rounded-md border border-gray-200">
                      {(localText[selectedClauseData.key] ?? selectedClauseData.text) || "—"}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        className="w-full min-h-[180px] text-sm leading-relaxed bg-white p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={draftText}
                        onChange={(e) => { setDraftText(e.target.value); setDirty(true); }}
                        placeholder="Edit clause text…"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onSaveClauseText}
                          className="inline-flex items-center h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setDirty(false);
                            setDraftText(localText[selectedClauseData.key] ?? selectedClauseData.text ?? "");
                          }}
                          className="inline-flex items-center h-9 px-4 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>

                      </div>
                    </div>
                  )}
                </div>

                {showCommentModal && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") closeCommentModal();
                    }}
                  >
                    <div
                      className="absolute inset-0 bg-black/40"
                      onClick={closeCommentModal}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Add Comment</h3>
                      </div>

                      <div className="p-4">
                       
                        <textarea
                          className="w-full min-h-[120px] text-sm leading-relaxed bg-white p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write your comment…"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              submitComment();
                            }
                          }}
                        />
                        <p className="mt-2 text-xs text-gray-500">Press Ctrl/⌘ + Enter to submit</p>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
                        <button
                          onClick={closeCommentModal}
                          className="h-9 px-4 rounded-md border border-gray-300 text-sm text-gray-800 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={submitComment}
                          disabled={!commentText.trim()}
                          className="h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Comments</h4>

                  {(!selectedClauseData.comments || selectedClauseData.comments.length === 0) ? (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {selectedClauseData.comments.map((c, i) => (
                        <li key={i} className="p-3 bg-white border border-gray-200 rounded-md">
                          <div className="text-sm text-gray-900">{c.text}</div>
                          <div className="mt-1 text-[12px] text-gray-500">
                            {c.author ? <span className="mr-2">{c.author}</span> : null}
                            {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="bg-blue-50 mt-3 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">AI Analysis</h4>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {selectedClauseData.analysis || "No analysis available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
