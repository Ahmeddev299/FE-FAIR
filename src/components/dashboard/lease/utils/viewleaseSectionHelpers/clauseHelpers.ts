/* eslint-disable @typescript-eslint/no-explicit-any */

// utils/clauseHelpers.ts

export const bulletKeyFromClause = (clause: any) => {
  const section = clause.section || clause.category || "";
  const bn = clause.bullet_number || clause.id || "1";
  return { section, bullet_number: String(bn) };
};

export const isNumericKey = (key: string): boolean => {
  return /^\d+$/.test(key);
};

export const getLeaseId = (currentLease: any): string => {
  return currentLease.lease_data._id || currentLease.lease_data.id || "";
};

export const calculateAiScore = (clause: any): number => {
  return clause?.ai_confidence_score
    ? Math.round(clause.ai_confidence_score * 100)
    : clause?.ai_score || 0;
};

export const getRiskColor = (risk: string): string => {
  const riskLevel = risk?.toLowerCase();
  
  if (riskLevel === "high") {
    return "bg-red-50 text-red-700";
  }
  if (riskLevel === "medium") {
    return "bg-yellow-50 text-yellow-700";
  }
  return "bg-green-50 text-green-700";
};