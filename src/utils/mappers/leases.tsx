// src/utils/mappers/leases.ts

export type ApiClause = {
  status?: string;
  clause_details?: string;
  current_version?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: unknown[];
  risk?: string; 
  created_at?: string;
  updated_at?: string;
};

export type ApiLeaseListResponse = {
  status: number;
  message: string;
  success: boolean;
  data: {
    total: number;
    page: number;
    limit: number;
    data: ApiLeaseItem[];
  };
};


// const getRiskScore = (risk?: string): number => {
//   const m = (risk || "").match(/\((\d+)\/10\)/);
//   return m ? parseInt(m[1], 10) : 0;
// };

// const isApiClauseObject = (v: unknown): v is ApiClause =>
//   typeof v === "object" && v !== null;

// const anyHighRisk = (item: ApiLeaseItem): boolean => {
//   const clauses = item.clauses ?? {};
//   return Object.entries(clauses)
//     .filter(([k]) => k !== "_clause_log_id")
//     .some(([, v]) => isApiClauseObject(v) && getRiskScore(v.risk) >= 7);
// };

// const deriveType = (title?: string): UILeaseBrief["type"] => {
//   const t = (title || "").toLowerCase();
//   if (t.startsWith("loi")) return "LOI";
//   if (t.includes("notice")) return "Notice";
//   if (t.includes("termination")) return "Termination";
//   return "Lease";
// };

// const daysUntil = (iso?: string): number => {
//   if (!iso) return Number.POSITIVE_INFINITY;
//   const now = Date.now();
//   const then = Date.parse(iso);
//   return Math.ceil((then - now) / (1000 * 60 * 60 * 24));
// };

// const deriveStatus = (item: ApiLeaseItem): UILeaseBrief["status"] => {
//   const d = daysUntil(item.endDate);
//   if (d <= 7) return "Expiring";

//   const clauses = item.clauses ?? {};
//   const entries = Object.entries(clauses).filter(([k]) => k !== "_clause_log_id");
//   if (entries.length === 0) return "Draft";

//   const allApproved = entries.every(([, v]) => isApiClauseObject(v) && v.status?.toLowerCase() === "approved");
//   if (allApproved) return "Signed";

//   const anyPending = entries.some(([, v]) => isApiClauseObject(v) && v.status?.toLowerCase() === "pending");
//   if (anyPending) return "Pending";

//   return "Draft";
// };

// const extractTags = (item: ApiLeaseItem): string[] => {
//   const tags = new Set<string>();
//   if (anyHighRisk(item)) tags.add("High Risk");

//   const clauseNames = Object.keys(item.clauses ?? {}).filter(k => k !== "_clause_log_id");
//   for (const name of clauseNames) {
//     const low = name.toLowerCase();
//     if (low.includes("4")) tags.add("Termination Clause");
//     if (low.includes("indemn")) tags.add("Indemnity");
//     if (low.includes("renewal")) tags.add("Renewal Option");
//     if (low.includes("security deposit")) tags.add("Security Deposit");
//     if (low.includes("delivery") || low.includes("commencement")) tags.add("Commencement");
//   }

//   return Array.from(tags).slice(0, 3);
// };

// export const getClauseDocId = (item: ApiLeaseItem): string | undefined =>
//   item.clauses?._clause_log_id || undefined;

// utils/mappers/leases.ts

export type ApiLeaseItem = {
  id?: string;              // API may use `id`
  _id?: string;             // or `_id`
  submit_status?: string;   // or:
  status?: string;          //   some payloads use `status`
  file_url?: string;        // "{'pdf_url':'...'}"
  fileUrl?: string;         // sometimes camelCased
  BASIC_INFORMATION?: { title?: string };
  basic_information?: { title?: string }; // sometimes snake/camel or lowercased block
  template_data?: { header?: { tenant_trade_name?: string } };
};

export type UILeaseBriefRow = {
  id: string;
  documentName: string;
  type: "Lease";
  documentId: string;
  status: string;
  tags: string[];
  _pdfUrl?: string;
  _clauseDocId?: string; // ← add this if you need it
};

export function mapLeaseListToUI(items: ApiLeaseItem[]): UILeaseBriefRow[] {
  return (items ?? []).map((it) => {
    const id = (it._id ?? it.id ?? "").toString();

    const title =
      it.BASIC_INFORMATION?.title?.trim() ||
      it.basic_information?.title?.trim() ||
      it.template_data?.header?.tenant_trade_name?.trim() ||
      "Untitled Lease";

    const status = it.submit_status || it.status || "Draft";

    // file_url may be JSON string with single quotes or a plain URL in fileUrl
    let pdfUrl: string | undefined;
    const raw = it.file_url ?? it.fileUrl;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw.replace(/'/g, '"'));
        pdfUrl = parsed?.pdf_url || parsed?.url || undefined;
      } catch {
        // if it's already a direct URL, accept it
        if (/^https?:\/\//i.test(raw)) pdfUrl = raw;
      }
    }

    return {
      id,
      documentName: title,
      type: "Lease",
      documentId: "-", // fill if you have a separate doc id
      status,
      tags: [],
      _pdfUrl: pdfUrl,
    };
  });
}

