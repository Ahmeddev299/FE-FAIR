import React from "react";
import { CheckCircle2, Clock, XCircle, X } from "lucide-react";

/* ------------------------------ Types ------------------------------ */

export type ClauseStatus = "approved" | "pending" | "need-review" | "rejected" | undefined;
export type RiskLevel = "Low" | "Medium" | "High" | undefined;

export interface ClauseComment {
  text: string;
  created_at?: string; // ISO string if available
  author?: string;     // optional, if you track who commented
}

export interface ClauseView {
  key: string;
  status?: ClauseStatus;
  risk?: RiskLevel;
  warning?: string;
  comments?: ClauseComment[]; // <-- no more any[]
  text?: string;
  analysis?: string;
  recommendation?: string;
  aiSuggestion?: string;
  confidenceScore?: number;
}

/* ---------------------------- UI Utilities ---------------------------- */

export const slugify = (s: string): string =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    New: "bg-blue-50 text-blue-700",
    "In Review": "bg-amber-50 text-amber-700",
    Submitted: "bg-amber-50 text-amber-700",
    Finalized: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };
  return colors[status] || "bg-gray-50 text-gray-700";
};

export const ClauseStatusIcon: React.FC<{ status?: ClauseStatus }> = ({ status }) => {
  if (status === "approved") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "pending") return <Clock className="w-4 h-4 text-amber-500" />;
  if (status === "rejected") return <X className="w-4 h-4 text-red-500" />;
  if (status === "need-review") return <XCircle className="w-4 h-4 text-rose-500" />;
  return <Clock className="w-4 h-4 text-amber-500" />;
};

export const RiskBadge: React.FC<{ risk?: RiskLevel }> = ({ risk }) => {
  const styles: Record<string, string> = {
    Low: "bg-[#DCFCE7] text-emerald-700",
    Medium: "bg-[#FEF9C3] text-amber-700",
    High: "bg-[#FEE2E2] text-rose-700",
  };
  const cls = styles[risk || ""] || "bg-gray-50 text-gray-700";
  const label = risk ? `${risk} Risk` : "—";
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
};
