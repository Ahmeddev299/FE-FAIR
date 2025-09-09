"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  Check,
  Bot,
  Edit3,
  Save,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { getClauseDetailsAsync } from "@/services/lease/asyncThunk";
// import { HistoryMetaMap } from "@/types/loi";

/* ---------- Types ---------- */
interface ClauseData {
  // minimal fields used in UI; extend to match API if needed
  risk: string; // e.g., "Low (2/10)"
  status: "approved" | "pending" | "rejected";
  current_version: string;
  ai_suggested_clause_details: string;
  clause_details: string;

  // possible id fields (we'll try several when extracting)
  clause_id?: string;
  id?: string;
  _id?: string;
}

type HistoryMap = Record<string, ClauseData>;

/* ---------- UI helpers ---------- */
const Pill: React.FC<{ tone?: "neutral" | "green" | "yellow" | "red" | "blue"; children: React.ReactNode }> = ({
  tone = "neutral",
  children,
}) => {
  const toneMap: Record<string, string> = {
    neutral: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${toneMap[tone]}`}>
      {children}
    </span>
  );
};

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`} {...props} />
);

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "approved") return <Pill tone="green">Approved</Pill>;
  if (s === "rejected") return <Pill tone="red">Rejected</Pill>;
  return <Pill tone="blue">Pending</Pill>;
};

const riskToTone = (risk: string) => {
  const lvl = parseInt(risk.match(/\((\d+)\/10\)/)?.[1] ?? "0", 10);
  return lvl >= 7 ? "red" : lvl >= 4 ? "yellow" : "green";
};

const RiskPill: React.FC<{ risk: string; labelPrefix?: string }> = ({ risk, labelPrefix }) => {
  const lvl = parseInt(risk.match(/\((\d+)\/10\)/)?.[1] ?? "0", 10);
  const tone = riskToTone(risk) as "green" | "yellow" | "red";
  return <Pill tone={tone}>{labelPrefix ? `${labelPrefix}: ` : ""}Risk Score: {lvl}/10</Pill>;
};

const ClauseListItem: React.FC<{
  name: string;
  clause: ClauseData;
  selected: boolean;
  onClick: () => void;
  getRiskColor: (risk: string) => "red" | "yellow" | "green";
  getRiskIcon: (risk: string) => LucideIcon;
}> = ({ name, clause, selected, onClick, getRiskColor, getRiskIcon }) => {
  const tone = getRiskColor(clause.risk);
  const Icon = getRiskIcon(clause.risk);
  const iconTone = tone === "red" ? "text-red-500" : tone === "yellow" ? "text-yellow-500" : "text-green-500";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group rounded-lg p-3 border transition-all flex flex-col gap-2
        ${selected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-200"}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white ring-2 ring-gray-100">
          <Icon className={`w-4 h-4 ${iconTone}`} />
        </span>
        <span className={`truncate text-sm ${selected ? "text-blue-700" : "text-gray-800"}`}>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <RiskPill risk={clause.risk} />
        <StatusBadge status={clause.status} />
      </div>
    </button>
  );
};

/* ---------- Component ---------- */
const LeaseClauseReview: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const leaseId = params?.leaseId as string;
  const clauseDocId = searchParams?.get("clauseDocId") ?? "";

  const { currentLease, isLoading } = useAppSelector((s) => s.lease);

  // UI State
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [riskFilter, setRiskFilter] = useState<string>("All Risk Levels");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [editingClause, setEditingClause] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);

  // Local editable copy of the history (for optimistic UI)
  const [localHistory, setLocalHistory] = useState<HistoryMap>({});

  /* ---------- Data fetch ---------- */
  useEffect(() => {
    if (leaseId && clauseDocId) {
      dispatch(getClauseDetailsAsync({ leaseId, clauseDocId }));
    }
  }, [dispatch, leaseId, clauseDocId]);

  // Sync local history when store changes
  useEffect(() => {
    if (currentLease?.data?.history) {
      setLocalHistory(currentLease.data.history as HistoryMap);
    }
  }, [currentLease?.data?.history]);

  // Select first clause by default
  useEffect(() => {
    if (localHistory && !selectedClause) {
      const names = Object.keys(localHistory);
      if (names.length) setSelectedClause(names[0]);
    }
  }, [localHistory, selectedClause]);

  /* ---------- Helpers ---------- */
  const getRiskLevel = (risk: string): number => {
    const match = risk.match(/\((\d+)\/10\)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const getRiskColor = (risk: string): "red" | "yellow" | "green" => {
    const level = getRiskLevel(risk);
    if (level >= 7) return "red";
    if (level >= 4) return "yellow";
    return "green";
  };

  const getRiskIcon = (risk: string): LucideIcon => {
    const level = getRiskLevel(risk);
    if (level >= 7) return AlertCircle;
    if (level >= 4) return AlertTriangle;
    return CheckCircle;
  };

  // const extractId = (c?: ClauseData): string | undefined =>
  // c?.clause_id ?? c?._id ?? c?.id;

  // Extract a clause id (try a few common places)
//   const getClauseId = (clauseName: string): string => {
//   // item is ClauseData | undefined (no any)
//   const item = localHistory[clauseName];
//   const fromHistory = extractId(item);
//   if (fromHistory) return fromHistory;

//   const meta = (currentLease?.data?.history_meta ?? {}) as HistoryMetaMap;
//   return meta[clauseName]?.id ?? "";
// };

  // Category grouping (keywords can be tuned)
  const groupClausesByCategory = (history: HistoryMap): Record<string, string[]> => {
    const categories: Record<string, string[]> = {
      Rent: [],
      "CAM Charges": [],
      Termination: [],
      Indemnity: [],
      "Terms & Conditions": [],
    };
    Object.keys(history).forEach((name) => {
      const n = name.toLowerCase();
      if (n.includes("rent")) categories["Rent"].push(name);
      else if (n.includes("cam") || n.includes("common area")) categories["CAM Charges"].push(name);
      else if (n.includes("terminat")) categories["Termination"].push(name);
      else if (n.includes("indemn")) categories["Indemnity"].push(name);
      else categories["Terms & Conditions"].push(name);
    });
    return categories;
  };

  const categories = useMemo(() => groupClausesByCategory(localHistory), [localHistory]);

  // Filtered names for each section
  const filterClauses = (clauses: string[]): string[] => {
    return clauses.filter((name) => {
      const clause = localHistory[name];
      if (!clause) return false;
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const level = getRiskLevel(clause.risk);
      const matchesRisk =
        riskFilter === "All Risk Levels" ||
        (riskFilter === "Low Risk" && level < 4) ||
        (riskFilter === "Medium Risk" && level >= 4 && level < 7) ||
        (riskFilter === "High Risk" && level >= 7);
      return matchesSearch && matchesRisk;
    });
  };

  const selectedClauseData: ClauseData | null =
    selectedClause && localHistory ? (localHistory[selectedClause] as ClauseData) : null;

  /* ---------- Toast ---------- */
  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  /* ---------- Actions ---------- */

  // Accept: replace Original with AI Suggested and save
  // const handleAccept = async (clauseName: string) => {
  //   const clause = localHistory?.[clauseName];
  //   if (!clause) return;

  //   const clauseId = getClauseId(clauseName);
  //   const newText = clause.ai_suggested_clause_details ?? "";

  //   // optimistic update
  //   setLocalHistory((prev) => ({
  //     ...prev,
  //     [clauseName]: {
  //       ...prev[clauseName],
  //       current_version: newText,
  //       status: "approved",
  //     },
  //   }));

  //   try {
  //     await fetch(
  //       `/clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/${clauseId}`,
  //       {
  //         method: "PUT", // adjust to PATCH if needed
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           clause_id: clauseId,
  //           clause_title: clauseName,
  //           // store the AI suggestion as the new current version
  //           current_version: newText,
  //           ai_suggested_clause_details: clause.ai_suggested_clause_details,
  //           action: "accept_ai_suggestion",
  //         }),
  //       }
  //     );
  //     showToastMessage("AI suggestion accepted successfully!");
  //   } catch (e) {
  //     // rollback on failure
  //     setLocalHistory((prev) => ({
  //       ...prev,
  //       [clauseName]: { ...prev[clauseName], current_version: clause.current_version, status: clause.status },
  //     }));
  //   }
  // };

  // Reject: cancel and go back
  const handleReject = () => {
    router.back();
  };

  // Edit: enable editing text area
  const handleEdit = (clauseName: string) => {
    setEditingClause(clauseName);
    setEditedContent(localHistory?.[clauseName]?.current_version ?? "");
  };

  // Save edited Original Clause to API
  // const handleSaveEdit = async (clauseName: string) => {
  //   const clauseId = getClauseId(clauseName);
  //   const newText = editedContent ?? "";

  //   // optimistic update
  //   setLocalHistory((prev) => ({
  //     ...prev,
  //     [clauseName]: { ...prev[clauseName], current_version: newText, status: "pending" },
  //   }));

  //   try {
  //     await fetch(
  //       `/clause/clause_detail_or_current_version_update_single_clauses_of_single_lease/${clauseId}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           clause_id: clauseId,
  //           clause_title: clauseName,
  //           current_version: newText,
  //           action: "manual_edit",
  //         }),
  //       }
  //     );
  //     showToastMessage("Clause edited and saved.");
  //   } catch (e) {
  //     // (optional) you can refetch or restore from previous if you keep a snapshot
  //   } finally {
  //     setEditingClause(null);
  //     setEditedContent("");
  //   }
  // };

  // CSV export of summary
  const handleExportSummary = () => {
    const rows = [["Clause", "Risk (0-10)", "Status"]];
    Object.entries(localHistory ?? {}).forEach(([name, c]) => {
      const risk = parseInt(c.risk.match(/\((\d+)\/10\)/)?.[1] ?? "0", 10);
      rows.push([name, String(risk), (c.status || "pending").toString()]);
    });

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lease_clause_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToastMessage("Summary exported successfully!");
  };

  // Simple printable page for the selected clause
  const handleDownloadPDF = () => {
    const clause = localHistory?.[selectedClause ?? ""];
    const w = window.open("", "_blank", "width=900,height=700");
    w!.document.write(`
      <html><head>
        <title>Lease Clause Review</title>
        <style>
          body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;line-height:1.5;}
          h1{font-size:18px;margin-bottom:12px;}
          h2{font-size:16px;margin-top:18px;margin-bottom:8px;}
          .box{border:1px solid #E5E7EB;border-radius:12px;padding:16px;margin-top:8px;}
          .muted{color:#4B5563;font-size:12px;}
        </style>
      </head><body>
        <h1>Lease Clause Review</h1>
        <div class="muted">${new Date().toLocaleString()}</div>
        <h2>${selectedClause ?? "Clause"}</h2>
        <div class="box"><strong>Original Clause</strong><div>${(clause?.current_version ?? "")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;")
          .replace(/\n/g,"<br/>")}</div></div>
        <div class="box"><strong>AI Suggested Clause</strong><div>${(clause?.ai_suggested_clause_details ?? "")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;")
          .replace(/\n/g,"<br/>")}</div></div>
        <div class="box"><strong>AI Analysis</strong><div>${(clause?.clause_details ?? "")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;")
          .replace(/\n/g,"<br/>")}</div></div>
      </body></html>
    `);
    w!.document.close();
    w!.focus();
    w!.print();
    w!.close();
    showToastMessage("PDF downloaded successfully!");
  };

  const handleAIAssistant = () => setShowAIAssistant(true);
  const closeAIAssistant = () => setShowAIAssistant(false);

  /* ---------- RENDER ---------- */
  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay isVisible />
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Toast */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          )}

          {/* AI Assistant Modal */}
          {showAIAssistant && (
            <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Legal Assistant</h3>
                  </div>
                  <button onClick={closeAIAssistant} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        I’m analyzing your lease clauses and can answer questions or suggest edits.
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li>• Explain complex lease terms</li>
                        <li>• Identify potential risks</li>
                        <li>• Suggest alternative language</li>
                        <li>• Compare clauses to market standards</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask me anything about this lease..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Ask
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Toolbar */}
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => router.back()} className="hidden sm:flex items-center text-gray-600 hover:text-gray-800">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Back to Upload</span>
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">Lease Clause Review</h1>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <FileText className="w-3 h-3" />
                      <span>{currentLease?.data?.clause_name || "Lease Document"}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={handleExportSummary}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Export Summary
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </button>
                  <button
                    onClick={handleAIAssistant}
                    className="flex items-center px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <Bot className="w-4 h-4 mr-2" /> AI Assistant
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    placeholder="Search clauses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 flex-1">
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Risk Levels</option>
                    <option>Low Risk</option>
                    <option>Medium Risk</option>
                    <option>High Risk</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Categories</option>
                    {Object.keys(categories).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 lg:px-8 py-6">
            {/* LEFT: Clauses */}
            <aside className="lg:col-span-3 space-y-4">
              <Card className="p-4">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wide uppercase mb-3">Lease Clauses</h3>
                <div className="space-y-4">
                  {Object.entries(categories).map(([category, clauses]) => {
                    if (categoryFilter !== "All Categories" && categoryFilter !== category) return null;
                    const filtered = filterClauses(clauses);
                    if (!filtered.length) return null;
                    return (
                      <section key={category} className="space-y-2">
                        <h4 className="text-[11px] font-semibold text-gray-500 uppercase px-1">{category}</h4>
                        <div className="space-y-2">
                          {filtered.map((clauseName) => {
                            const clause = localHistory[clauseName];
                            if (!clause) return null;
                            return (
                              <ClauseListItem
                                key={clauseName}
                                name={clauseName}
                                clause={clause}
                                selected={selectedClause === clauseName}
                                onClick={() => setSelectedClause(clauseName)}
                                getRiskColor={getRiskColor}
                                getRiskIcon={getRiskIcon}
                              />
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </Card>
            </aside>

            {/* CENTER: Clause detail */}
            <main className="lg:col-span-6 space-y-4">
              {selectedClauseData ? (
                <>
                  {/* Header */}
                  <Card className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{selectedClause}</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <RiskPill risk={selectedClauseData.risk} />
                          <StatusBadge status={selectedClauseData.status} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {editingClause === selectedClause ? (
                          <>
                            <button
                              // onClick={() => handleSaveEdit(selectedClause!)}
                              className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                            >
                              <Save className="inline-block w-4 h-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingClause(null);
                                setEditedContent("");
                              }}
                              className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                              <X className="inline-block w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Card>

                  {/* Original + AI Suggested */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-gray-900">Original Clause</span>
                      </div>
                      {editingClause === selectedClause ? (
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={10}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-700 text-sm whitespace-pre-line">{selectedClauseData.current_version}</p>
                      )}
                    </Card>

                    <Card className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                          AI
                        </span>
                        <span className="text-sm font-semibold text-gray-900">AI Suggested Clause</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {selectedClauseData.ai_suggested_clause_details}
                      </p>
                    </Card>
                  </div>

                  {/* AI Analysis */}
                  <Card className="p-5 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-700 font-semibold text-sm">AI Analysis & Recommendations</span>
                    </div>
                    {selectedClauseData.clause_details && (
                      <p className="text-sm text-gray-800">{selectedClauseData.clause_details}</p>
                    )}
                  </Card>

                  <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Reject */}
                      <button
                        type="button"
                        onClick={() => handleReject()}
                        aria-label="Reject suggestion"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 text-sm font-medium text-red-700 shadow-sm transition
                          hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleEdit(selectedClause!)}
                        aria-label="Edit clause"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-800 shadow-sm transition
                          hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-gray-700" />
                        <span>Edit</span>
                      </button>

                      {/* Accept Suggestion */}
                      <button
                        type="button"
                        // onClick={() => handleAccept(selectedClause!)}
                        aria-label="Accept AI suggestion"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white shadow-sm transition
                          hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60
                          disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Accept Suggestion</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Card className="p-6 text-sm text-gray-500">Select a clause from the left to view details.</Card>
              )}
            </main>

            {/* RIGHT: Assistant & Recommendations */}
            <aside className="lg:col-span-3 space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                    AI
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">AI Legal Assistant</h3>
                </div>
                <p className="text-xs text-gray-600">
                  I’m analyzing your lease clauses and providing personalized recommendations based on best practices.
                </p>
                <button
                  onClick={handleAIAssistant}
                  className="mt-3 w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ask AI a Question
                </button>
              </Card>

              <Card className="p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">General Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Review all high-risk clauses</div>
                    <Pill tone="red">High</Pill>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Check jurisdiction compliance</div>
                    <Pill tone="yellow">Medium</Pill>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Document your changes</div>
                    <Pill tone="green">Low</Pill>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={handleExportSummary}
                    className="w-full text-left px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Generate Summary
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full text-left px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Download PDF
                  </button>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaseClauseReview;
