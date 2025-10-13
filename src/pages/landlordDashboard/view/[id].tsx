"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, CheckCircle2, XCircle, ChevronLeft, Download, X, FileText, Clock, AlertCircle, DownloadIcon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
    getLOIDetailsById,
    llCommentClauseAsync,
    llDecideClauseAsync,
    llReadClauseAsync,
    llApproveAllAsync,
    llRejectAllAsync,
} from "@/services/loi/asyncThunk";
import { selectLOI } from "@/redux/slices/loiSlice";
import { ClauseStatus, LOIApiPayload } from "@/types/loi";
import { transformToApiPayload } from "@/utils/apiTransform";
import axios from "axios";
import Config from "@/config/index";
import { normalizeLoiResponse } from "@/pages/dashboard/pages/loi/view/[id]";
import Toast from "@/components/Toast";
import { getStatus, LoiServerData } from "@/services/dashboard/asyncThunk";
import { exportLoiToDocx } from "@/utils/exportDocx";
import ls from "localstorage-slim";
import { ErrorMessage } from "@/components/dashboard/ErrorMessage";

export default function ClauseDetailPanel() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams() as { id?: string | string[]; clause?: string | string[] };
    const [isDownloading, setIsDownloading] = useState(false);
    const downloadingRef = useRef(false);

    const isMountedRef = useRef(true);
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const { loiList, currentLOI, loading } = useAppSelector(selectLOI);
    const [selectedLOI, setSelectedLOI] = useState<any>(null);
    const [selectedClauseKey, setSelectedClauseKey] = useState<string | null>(null);
    const [isDownloadingLoi, setIsDownloadingLoi] = useState(false);

    // Optimistic UI states
    const [localStatus, setLocalStatus] = useState<Record<string, ClauseStatus>>({});
    const [localComments, setLocalComments] = useState<Record<string, Array<{ text: string; created_at: string }>>>({});

    // Extract route params
    const routeLoiId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const routeClauseSlug = Array.isArray(params?.clause) ? params.clause[0] : params?.clause;

    // Utility: slugify
    const slugify = (str: string) => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const [docid, setdocid] = useState<string | undefined>(undefined);

    useEffect(() => {
        const id = Array.isArray(routeLoiId) ? routeLoiId[0] : routeLoiId;
        if (id) void dispatch(getLOIDetailsById(String(id)));
        setdocid(id)
    }, [dispatch, routeLoiId]);

    // 1) Fetch LOI details directly from URL ID (don't wait for list)
    useEffect(() => {
        if (!routeLoiId) return;

        // Fetch LOI details immediately
        dispatch(getLOIDetailsById(routeLoiId));

        // If loiList is available, set selected LOI for display
        if (loiList?.my_loi?.length) {
            const found = (loiList.my_loi || []).find((x: any) => String(x.id) === String(routeLoiId));
            if (found) {
                setSelectedLOI(found);
            }
        }
    }, [dispatch, routeLoiId, loiList?.my_loi]);

    // 2) Build clauses array (landlord-specific)
    const clauses = useMemo(() => {
        if (!currentLOI?.Clauses?.history) return [];
        const history = currentLOI.Clauses.history;

        return Object.entries(history).map(([key, data]: [string, any]) => {
            const baseStatus: ClauseStatus = data.status_landlord || data.status;
            const overridden = localStatus[key] ?? undefined;
            return {
                key,
                status: overridden || baseStatus,
                risk: data.risk_landlord,
                warning: data.risk_line_landlord,
                comments: localComments[key] || data.comment || [],
                text: data.current_version || data.clause_details,
                analysis: data.Analysis_landlord,
                recommendation: data.Recommendation_landlord,
                aiSuggestion: data.ai_suggested_clause_details_landlord,
                confidenceScore: data.ai_confidence_score,
            };
        });
    }, [currentLOI, localStatus, localComments]);

    // 3) Slug map for converting slug to clause key
    const slugMap = useMemo(() => {
        const m = new Map<string, string>();
        clauses.forEach((c) => m.set(slugify(c.key), c.key));
        return m;
    }, [clauses]);

    // 4) Auto-select first clause if URL has slug
    useEffect(() => {
        if (!routeLoiId || !currentLOI?.Clauses?.history) return;

        // If slug in URL, select that clause
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
        // Don't navigate - just update state and mark as read
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
            setLocalComments((prev) => {
                const arr = prev[clauseKey] ? [...prev[clauseKey]] : [];
                arr.unshift({ text, created_at: new Date().toISOString() });
                return { ...prev, [clauseKey]: arr };
            });
            dispatch(llCommentClauseAsync({ loiId: routeLoiId, clause_key: clauseKey, text }));
        },
        [dispatch, routeLoiId]
    );

    const selectedClauseData = useMemo(() => {
        if (!selectedClauseKey) return null;
        return clauses.find((c) => c.key === selectedClauseKey) || null;
    }, [selectedClauseKey, clauses]);

    /* -------------------------------- UI Helpers -------------------------------- */

    const getStatusColor = (status: string) => {
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

    const getRiskBadge = (risk?: string) => {
        const styles: Record<string, string> = {
            Low: "bg-[#DCFCE7] text-emerald-700",
            Medium: "bg-[#FEF9C3] text-yellow-700",
            High: "bg-[#FEE2E2] text-rose-700",
        };
        const cls = styles[risk || ""] || "bg-gray-50 text-gray-700";
        const label = risk ? `${risk} Risk` : "—";
        return <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
    };

    /* ----------------------------------- UI ----------------------------------- */

    // Show loading while fetching
    if (!currentLOI?.Clauses?.history && routeLoiId) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-500">Loading LOI details...</div>
                </div>
            </DashboardLayout>
        );
    }

    const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === "object" && v !== null;

    const errorMessage = (e: unknown): string => {
        if (typeof e === "string") return e;
        if (isRecord(e) && "message" in e && typeof (e as { message?: unknown }).message === "string") {
            return (e as { message?: string }).message ?? "Unknown error";
        }
        return "Something went wrong";
    };

    const handleSubmitLOI = async () => {
        if (downloadingRef.current) return;
        downloadingRef.current = true;
        setIsDownloading(true);
        try {
            const token = ls.get("access_token", { decrypt: true });
            if (!token) throw new Error("Authentication token not found");

            const resp = await axios.post(
                `${Config.API_ENDPOINT}/dashboard/submit_clauses`,

                {
                    doc_id: docid

                },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            );

            const maybe = resp as { data?: { success?: boolean; message?: string } };
            if (maybe?.data?.success === false) throw new Error(maybe.data.message || "Failed to fetch LOI");

            const msg = maybe?.data?.message;
            if (msg) Toast.fire({ icon: "success", title: msg });

            // const data = normalizeLoiResponse(resp);
            // const isTemp = resp.data?.data?.temp === true;
            // console.log("isTem", isTemp)
            // await exportLoiToDocx(data, undefined, isTemp);
            if (isMountedRef.current) Toast.fire({ icon: "success", title: "LOI exported successfully" });
        } catch (err: unknown) {
            Toast.fire({ icon: "warning", title: ErrorMessage(err) });
        } finally {
            downloadingRef.current = false;
            setIsDownloading(false);
        }
    };

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
        } finally {
            downloadingRef.current = false;
            setIsDownloading(false);
        }
    };

    // Use currentLOI data for display if selectedLOI not set yet
    const displayLOI = selectedLOI || currentLOI;
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
                                    <span className="font-medium text-gray-900">${displayLOI?.leaseTerms?.monthlyRent || "-"}/mo</span>
                                </div>
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${getStatusColor(
                                        displayLOI?.submit_status || "In Review"
                                    )}`}
                                >
                                    {displayLOI?.submit_status || "In Review"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-3 flex items-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedLOI(null);
                                setSelectedClauseKey(null);
                                setLocalStatus({});
                                setLocalComments({});
                                router.push("/landlordDashboard/view");
                            }}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>

                        <div className="flex-1" />

                        <div className="w-full mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isDownloadingLoi || downloadingRef.current}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                {isDownloadingLoi ? "Downloading…" : "Download"}
                            </button>

                        </div>
                        {/* <button
                            onClick={async () => {
                                if (!routeLoiId) return;
                                await dispatch(llRejectAllAsync(routeLoiId));
                                if (currentLOI?.Clauses?.history) {
                                    const next: Record<string, ClauseStatus> = {};
                                    Object.keys(currentLOI.Clauses.history).forEach((k) => (next[k] = "rejected"));
                                    setLocalStatus((prev) => ({ ...prev, ...next }));
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700"
                        >
                            <X className="w-4 h-4" />
                            Send Back
                        </button> */}
                        <button
                            onClick={async () => {
                                if (!routeLoiId) return;
                                await dispatch(llApproveAllAsync(routeLoiId));
                                if (currentLOI?.Clauses?.history) {
                                    const next: Record<string, ClauseStatus> = {};
                                    Object.keys(currentLOI.Clauses.history).forEach((k) => (next[k] = "approved"));
                                    setLocalStatus((prev) => ({ ...prev, ...next }));
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve All
                        </button>
                        <button
                            onClick={handleSubmitLOI}
                            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            Finalize LOI
                        </button>
                    </div>
                </div>

                {/* Clauses Section */}
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                                {clauses.map((cl: any) => (
                                    <button
                                        key={cl.key}
                                        onClick={() => handleOpenClause(cl.key)}
                                        className={`text-left p-4 rounded-lg transition-all ${selectedClauseKey === cl.key
                                            ? "bg-[#EFF6FF] border-2 border-blue-400"
                                            : "bg-white border border-[#E2E8F0] hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-medium text-sm text-gray-900 flex-1 pr-2">{cl.key}</h3>
                                            {getClauseStatusIcon(cl.status)}
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {getRiskBadge(cl.risk)}
                                        </div>

                                        {cl.comments?.length > 0 && (
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
                                            {getRiskBadge(selectedClauseData.risk)}
                                        </div>

                                        {/* Compliant Badge */}
                                        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-blue-700 bg-blue-50 rounded-md font-medium" disabled>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Compliant
                                        </button>

                                        {/* Reject Button */}
                                        <button
                                            onClick={() => onRejectClause(selectedClauseData.key)}
                                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-rose-700 bg-white rounded-md border border-rose-300 font-medium hover:bg-rose-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>

                                        {/* Approve Button */}
                                        <button
                                            onClick={() => onApproveClause(selectedClauseData.key)}
                                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-blue-700 bg-white rounded-md border border-blue-300 font-medium hover:bg-blue-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve
                                        </button>

                                        {/* Comment Button */}
                                        <button
                                            onClick={() => {
                                                const text = prompt("Add a comment to this clause:");
                                                if (text) onCommentClause(selectedClauseData.key, text);
                                            }}
                                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 text-gray-700 bg-white rounded-md border border-gray-300 font-medium hover:bg-gray-50"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Comment
                                        </button>
                                    </div>
                                </div>

                                {/* Clause Text */}
                                <div className="mb-5">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Clause Text</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200">
                                        {selectedClauseData.text || "—"}
                                    </p>
                                </div>

                                {/* AI Analysis */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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