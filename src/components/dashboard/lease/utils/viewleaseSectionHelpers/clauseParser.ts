// utils/clauseParser.ts
import { isNumericKey } from "./clauseHelpers";

export const parseClausesData = (currentLease: any) => {
  if (!currentLease?.clauses?.history) {
    return { categories: {}, allCategories: [] };
  }

  const history = currentLease.clauses.history;
  const categories: Record<string, any[]> = {};
  const allCategories: string[] = [];

  Object.keys(history).forEach((categoryKey) => {
    const categoryData = history[categoryKey];

    if (typeof categoryData === 'object' && categoryData !== null) {
      const clauses = Object.entries(categoryData).map(([key, clause]: [string, any]) => {
        const isNumeric = isNumericKey(key);

        return {
          id: key,
          bullet_number: key,
          title: isNumeric ? clause.current_version : key,
          category: categoryKey,
          section: categoryKey,
          keyType: isNumeric ? 'numeric' : 'descriptive',
          status: clause.status || "pending",
          ai_confidence_score: clause.ai_confidence_score || 0,
          ai_score: Math.round((clause.ai_confidence_score || 0) * 100),
          risk: clause.risk || "Low",
          risk_level: clause.risk || "Low",
          comments: clause.comment || [],
          clause_details: clause.clause_details || "",
          current_version: clause.current_version || clause.clause_details || "",
          ...clause
        };
      });

      categories[categoryKey] = clauses;
      allCategories.push(categoryKey);
    }
  });

  return { categories, allCategories };
};