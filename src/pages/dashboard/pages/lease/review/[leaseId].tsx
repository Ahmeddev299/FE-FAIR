"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { DashboardLayout } from "@/components/layouts";
import { LoadingOverlay } from "@/components/loaders/overlayloader";
import { getClauseDetailsAsync } from "@/services/lease/asyncThunk";

import { HistoryMap } from "@/types/loi";
import { Card, getRiskLevel } from "@/components/clauses/ui";
import ClauseList from "@/components/clauses/ClauseList";
import ClauseDetail from "@/components/clauses/ClauseDetails";
import AssistantModal from "@/components/clauses/ClauseAssistantModel";
import TopToolbar from "@/components/clauses/TopToolBar";
import FiltersBar from "@/components/clauses/Filterbar";
import {
  acceptClauseSuggestionAsync,
  updateClauseCurrentVersionAsync,
} from "@/services/lease/asyncThunk";

const LeaseClauseReview: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const leaseId = params?.leaseId as string;
  const clauseDocId = searchParams?.get("clauseDocId") ?? "";

  const { currentLease, isLoading } = useAppSelector((s) => s.lease);

  // ---- UI State
  const [selectedClause, setSelectedClause] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [riskFilter, setRiskFilter] = useState<string>("All Risk Levels");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [editingClause, setEditingClause] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);

  // NEW: action-specific loader state
  const [actionLoading, setActionLoading] = useState<null | "accept" | "save">(null);

  // local editable copy of history
  const [localHistory, setLocalHistory] = useState<HistoryMap>({});

  // ---- Data
  useEffect(() => {
    if (leaseId && clauseDocId) {
      dispatch(getClauseDetailsAsync({ leaseId, clauseDocId }));
    }
  }, [dispatch, leaseId, clauseDocId]);

  useEffect(() => {
    if (currentLease?.data?.history) {
      setLocalHistory(currentLease.data.history as HistoryMap);
    }
  }, [currentLease?.data?.history]);

  // select first clause initially
  useEffect(() => {
    if (localHistory && !selectedClause) {
      const first = Object.keys(localHistory)[0];
      if (first) setSelectedClause(first);
    }
  }, [localHistory, selectedClause]);

  // ---- Utils
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

  const filterClauses = (names: string[]) =>
    names.filter((name) => {
      const c = localHistory[name];
      if (!c) return false;
      const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const lvl = getRiskLevel(c.risk);
      const matchRisk =
        riskFilter === "All Risk Levels" ||
        (riskFilter === "Low Risk" && lvl < 4) ||
        (riskFilter === "Medium Risk" && lvl >= 4 && lvl < 7) ||
        (riskFilter === "High Risk" && lvl >= 7);
      return matchSearch && matchRisk;
    });

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ---- Actions
  const handleAccept = async (clauseName: string) => {
    if (actionLoading) return; // prevent double-fire while loading
    const clause = localHistory?.[clauseName];
    if (!clause) return;

    const newText = clause.ai_suggested_clause_details ?? "";
    const prev = localHistory[clauseName];

    // optimistic
    setLocalHistory((p) => ({
      ...p,
      [clauseName]: { ...p[clauseName], current_version: newText, status: "approved" },
    }));

    setActionLoading("accept"); // NEW
    try {
      await dispatch(
        acceptClauseSuggestionAsync({
          clauseId: clauseDocId,
          clause_key: clauseName,
          details: newText,
        })
      ).unwrap();
      showToastMessage("AI suggestion accepted successfully!");
    } catch {
      // rollback
      setLocalHistory((p) => ({ ...p, [clauseName]: prev }));
    } finally {
      setActionLoading(null); // NEW
    }
  };

  const handleReject = () => router.back();

  const handleEdit = (clauseName: string) => {
    setEditingClause(clauseName);
    setEditedContent(localHistory?.[clauseName]?.current_version ?? "");
  };

  const handleSaveEdit = async (clauseName: string) => {
    if (actionLoading) return; // prevent double-fire while loading
    const newText = editedContent ?? "";
    const prev = localHistory[clauseName];

    // optimistic
    setLocalHistory((p) => ({
      ...p,
      [clauseName]: { ...p[clauseName], current_version: newText, status: "pending" },
    }));

    setActionLoading("save"); // NEW
    try {
      await dispatch(
        updateClauseCurrentVersionAsync({ clauseId: clauseDocId, clause_key: clauseName, details: newText })
      ).unwrap();
      showToastMessage("Clause edited and saved.");
    } catch {
      // rollback
      setLocalHistory((p) => ({ ...p, [clauseName]: prev }));
    } finally {
      setEditingClause(null);
      setEditedContent("");
      setActionLoading(null); // NEW
    }
  };

  const handleExportSummary = () => {
    const rows = [["Clause", "Risk (0-10)", "Status"]];

    Object.entries(localHistory ?? {}).forEach(([name, c]) => {
      const risk = getRiskLevel(c.risk);
      rows.push([name, String(risk), (c.status || "pending").toString()]);
    });

    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lease_clause_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToastMessage("Summary exported successfully!");
  };

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
          .replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\n/g,"<br/>")}</div></div>
        <div class="box"><strong>AI Suggested Clause</strong><div>${(clause?.ai_suggested_clause_details ?? "")
          .replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\n/g,"<br/>")}</div></div>
        <div class="box"><strong>AI Analysis</strong><div>${(clause?.clause_details ?? "")
          .replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\n/g,"<br/>")}</div></div>
      </body></html>
    `);
    w!.document.close();
    w!.focus();
    w!.print();
    w!.close();
    showToastMessage("PDF downloaded successfully!");
  };

  // ---- Render
  const title = currentLease?.data?.clause_name || "Lease Document";

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingOverlay isVisible />
      ) : (
        <div className="min-h-screen bg-gray-50 relative">
          {/* Toast */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          )}

          {actionLoading && (
                    <LoadingOverlay isVisible />

          )}

          <TopToolbar
            title={title}
            onBack={() => router.back()}
            onExportSummary={handleExportSummary}
            onDownloadPDF={handleDownloadPDF}
            onOpenAI={() => setShowAIAssistant(true)}
          />

          {/* Filters */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <FiltersBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              riskFilter={riskFilter}
              setRiskFilter={setRiskFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={Object.keys(categories)}
            />
          </div>

          {/* 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 lg:px-8 pb-6">
            {/* LEFT: list */}
            <aside className="lg:col-span-3 space-y-4">
              <ClauseList
                categories={categories}
                categoryFilter={categoryFilter}
                filterFn={filterClauses}
                history={localHistory}
                selectedClause={selectedClause}
                onSelect={(name) => {
                  if (actionLoading) return; // prevent switching while loading
                  setSelectedClause(name);
                }}
              />
            </aside>

            {/* CENTER: detail */}
            <main className="lg:col-span-6 space-y-4 relative">
              {selectedClause && localHistory[selectedClause] ? (
                <ClauseDetail
                  clauseName={selectedClause}
                  clause={localHistory[selectedClause]}
                  editing={editingClause === selectedClause}
                  editedContent={editedContent}
                  onChangeEditedContent={setEditedContent}
                  onSaveEdit={() => handleSaveEdit(selectedClause)}
                  onCancelEdit={() => {
                    if (actionLoading) return;
                    setEditingClause(null);
                    setEditedContent("");
                  }}
                  onEdit={() => {
                    if (actionLoading) return;
                    handleEdit(selectedClause);
                  }}
                  onAccept={() => handleAccept(selectedClause)}
                  onReject={() => {
                    if (actionLoading) return;
                    handleReject();
                  }}
                />
              ) : (
                <Card className="p-6 text-sm text-gray-500">
                  Select a clause from the left to view details.
                </Card>
              )}
            </main>

            {/* RIGHT: assistant + recommendations */}
            <aside className="lg:col-span-3 space-y-4">
              <Card className="p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">General Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Review all high-risk clauses</div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      High
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Check jurisdiction compliance</div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm text-gray-800">Document your changes</div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Low
                    </span>
                  </div>
                </div>
              </Card>
            </aside>
          </div>

          <AssistantModal open={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaseClauseReview;
