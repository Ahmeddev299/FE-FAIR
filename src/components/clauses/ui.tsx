import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, LucideIcon } from "lucide-react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`} {...props} />
);

export const Pill: React.FC<{ tone?: "neutral" | "green" | "yellow" | "red" | "blue"; children: React.ReactNode }> = ({
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
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${toneMap[tone]}`}>{children}</span>;
};

export const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "approved") return <Pill tone="green">Approved</Pill>;
  if (s === "rejected") return <Pill tone="red">Rejected</Pill>;
  return <Pill tone="blue">Pending</Pill>;
};

export const getRiskLevel = (risk: string): number => {
  const match = risk.match(/\((\d+)\/10\)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const getRiskColor = (risk: string): "red" | "yellow" | "green" => {
  const level = getRiskLevel(risk);
  if (level >= 7) return "red";
  if (level >= 4) return "yellow";
  return "green";
};

export const getRiskIcon = (risk: string): LucideIcon => {
  const level = getRiskLevel(risk);
  if (level >= 7) return AlertCircle;
  if (level >= 4) return AlertTriangle;
  return CheckCircle;
};

export const RiskPill: React.FC<{ risk: string; labelPrefix?: string }> = ({ risk, labelPrefix }) => {
  const lvl = getRiskLevel(risk);
  const tone = getRiskColor(risk) as "green" | "yellow" | "red";
  return <Pill tone={tone}>{labelPrefix ? `${labelPrefix}: ` : ""}Risk Score: {lvl}/10</Pill>;
};
