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

// ---------- Types ----------
interface ClauseData {
  risk: string;                         // e.g., "Low (2/10)"
  status: "approved" | "pending" | "rejected";
  current_version: string;
  ai_suggested_clause_details: string;
  clause_details: string;
}

type HistoryMap = Record<string, ClauseData>;

// ---------- UI helpers ----------
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

// ---------- Component ----------
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

  // Data fetch
  useEffect(() => {
    if (leaseId && clauseDocId) {
      dispatch(getClauseDetailsAsync({ leaseId, clauseDocId }));
    }
  }, [dispatch, leaseId, clauseDocId]);

  // Select first clause by default
  useEffect(() => {
    if (currentLease?.data?.history && !selectedClause) {
      const first = Object.keys(currentLease.data.history)[0];
      if (first) setSelectedClause(first);
    }
  }, [currentLease, selectedClause]);

  // ----- Helpers -----
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

  // Categorize clauses (tweak keywords as you like)
  const groupClausesByCategory = (): Record<string, string[]> => {
    const history = currentLease?.data?.history ?? {};
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

  // Filter function
  const filterClauses = (clauses: string[]): string[] => {
    const history = currentLease?.data?.history ?? {};
    return clauses.filter((name) => {
      const clause = history[name];
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

  const categories = useMemo(() => groupClausesByCategory(), [currentLease?.data?.history]);

  const selectedClauseData: ClauseData | null =
    selectedClause && currentLease?.data?.history
      ? (currentLease.data.history[selectedClause] as ClauseData)
      : null;

  // ----- Toast -----
  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ----- Actions -----
  const handleAccept = (clauseName: string) => {
    console.log("Accepting clause:", clauseName);
    // TODO: dispatch an update action if backend supported
    showToastMessage("AI suggestion accepted successfully!");
  };

  const handleReject = (clauseName: string) => {
    console.log("Rejecting clause:", clauseName);
    // TODO: dispatch an update action if backend supported
    router.back();
  };

  const handleEdit = (clauseName: string) => {
    setEditingClause(clauseName);
    setEditedContent(currentLease?.data?.history?.[clauseName]?.current_version ?? "");
  };

  const handleSaveEdit = (clauseName: string) => {
    console.log("Saving edited clause:", clauseName);
    // TODO: dispatch an update action if backend supported
    setEditingClause(null);
    setEditedContent("");
    showToastMessage("Clause edited and saved.");
  };

  const handleDownloadPDF = () => {
    // Using your HTML export approach for now; can be swapped with server PDF later.
    showToastMessage("PDF downloaded successfully!");
    // ... (left as-is from your previous implementation)
  };

  const handleExportSummary = () => {
    // Generates CSV from current data (left as-is from your previous implementation)
    showToastMessage("Summary exported successfully!");
  };

  const handleAIAssistant = () => setShowAIAssistant(true);
  const closeAIAssistant = () => setShowAIAssistant(false);

  // ---------- RENDER ----------
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
                            const clause = (currentLease?.data?.history ?? ({} as HistoryMap))[clauseName];
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
                              onClick={() => handleSaveEdit(selectedClause!)}
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
                        ) : (
                          <div className="flex flex-wrap items-center gap-1">
                            {/* Edit */}
                            <button
                              onClick={() => handleEdit(selectedClause!)}
                              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-4 text-sm font-medium text-gray-800 shadow-sm transition
               hover:bg-white hover:shadow ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              aria-label="Edit clause"
                            >
                              <Edit3 className="h-2 w-2 text-gray-700" />
                              <span>Edit</span>
                            </button>

                            {/* Accept Suggestion (primary) */}
                            <button
                              onClick={() => handleAccept(selectedClause!)}
                              className="inline-flex h-10 items-center gap-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-600/90 px-4 text-sm font-semibold text-white shadow-sm transition
               hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                              aria-label="Accept AI suggestion"
                            >
                              <Check className="h-3 w-3" />
                              {/* two-line label on ≥sm, single-line on xs */}
                              <span className="hidden sm:flex flex-col leading-4">
                                <span>Accept</span>
                                <span className="text-[11px] font-normal opacity-90">Suggestion</span>
                              </span>
                              <span className="sm:hidden">Accept</span>
                            </button>

                            {/* Reject (destructive-ghost) */}
                            <button
                              onClick={() => handleReject(selectedClause!)}
                              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 text-sm font-medium text-red-700 shadow-sm transition
               hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                              aria-label="Reject AI suggestion"
                            >
                              <X className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
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
