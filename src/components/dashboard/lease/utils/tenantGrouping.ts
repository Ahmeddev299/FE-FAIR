// utils/tenantGrouping.ts
import { Clause } from "@/components/landlord/loi/types";

export const filterClauses = (clauses: Clause[], status: string, query: string) => {
  const q = query.trim().toLowerCase();
  return clauses.filter(c => {
    const sOk = status === "all" || (c.status || "pending").toLowerCase() === status;
    const qOk =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.clause_details?.toLowerCase().includes(q);
    return sOk && qOk;
  });
};

export const groupTenantClauses = (clauses: Clause[]) => {
  const agrees: Clause[] = [];
  const notAgrees: Clause[] = [];

  const has = (s = "", patterns: string[]) => patterns.some(p => s.includes(p));
  clauses.forEach(c => {
    const text = ((c.title || "") + " " + (c.clause_details || "")).toLowerCase();
    if (has(text, ["tenant shall not", "tenant may not", "tenant must not", "prohibited", "forbidden", "not permitted"])) {
      notAgrees.push(c);
    } else {
      agrees.push(c);
    }
  });

  return { agrees, notAgrees };
};

export const groupByCategory = (clauses: Clause[]) =>
  clauses.reduce<Record<string, Clause[]>>((acc, c) => {
    const key = c.category || "Other";
    (acc[key] ||= []).push(c);
    return acc;
  }, {});
