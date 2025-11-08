/* eslint-disable @typescript-eslint/no-explicit-any */

import { Clause } from "@/types/lease";

export const processClausesFromAPI = (data: any): Clause[] => {
  const clausesList: Clause[] = [];

  if (data.clauses?.history) {
    Object.entries(data.clauses.history).forEach(([category, categoryData]: [string, any]) => {
      Object.entries(categoryData).forEach(([key, clauseData]: [string, any]) => {
        const id = `${category}::${key}`;
        clausesList.push({
          id,
          name: `${category} #${key}`,
          title: `${category} - Clause ${key}`,
          category,
          clause_details: clauseData.clause_details,
          status: clauseData.status || "pending",
          risk: clauseData.risk || "Medium",
          ai_confidence_score: clauseData.ai_confidence_score,
          ai_suggested_clause_details: clauseData.ai_suggested_clause_details,
          comments: clauseData.comment || [],
          current_version: clauseData.current_version,
          updated_at: clauseData.updated_at,
        });
      });
    });
  }

  return clausesList;
};
