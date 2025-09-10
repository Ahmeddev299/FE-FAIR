// // components/leases/utils.ts
// import type { ApiLease, ApiClause, UILease, UIClause } from '@/types/loi'
// import type { RiskLevel, ClauseStatus } from '@/types/loi';

// const riskFromApi = (apiRisk?: string): RiskLevel => {
//   if (!apiRisk) return 'Low';
//   const m = apiRisk.match(/\((\d+)\/10\)/);
//   const n = parseInt(m?.[1] ?? '0', 10);
//   if (n >= 7) return 'High';
//   if (n >= 4) return 'Medium';
//   return 'Low';
// };

// const statusFromApi = (apiStatus?: string): ClauseStatus => {
//   const s = (apiStatus || '').toLowerCase();
//   if (s === 'approved') return 'Approved';
//   if (s === 'edited') return 'Edited';
//   if (s === 'pending') return 'Pending';
//   if (s === 'review' || s === 'needs_review') return 'Needs Review';
//   return 'AI Suggested';
// };

// export const normalizeLease = (raw: ApiLease): UILease => {
//   const rawClauses = (raw?.clauses ?? {}) as Record<string, unknown>;

//   // pull out backend clause log id if provided as a magic key
//   const clauseDocId = String((rawClauses as any)?._clause_log_id ?? '');

//   const clauses: UIClause[] = Object.entries(rawClauses)
//     .filter(([k]) => k !== '_clause_log_id')
//     .map(([name, v], i) => {
//       const val: ApiClause = (typeof v === 'object' && v !== null ? v : {}) as ApiClause;
//       return {
//         id: String(i + 1),
//         name,
//         status: statusFromApi(val.status),
//         risk: riskFromApi(val.risk),
//         currentVersion: val.current_version ?? '',
//         aiSuggestion: val.ai_suggested_clause_details ?? '',
//         details: val.clause_details ?? '',
//       };
//     });

//   const approvedCount = clauses.filter(c => c.status === 'Approved').length;
//   const totalCount = clauses.length;
// const unresolvedCount = clauses.filter(
//   c => c.status === 'Needs Review' || c.risk === 'High'
// ).length;

//   return {
//     id: String(raw.id),
//     title: raw.title,
//     property_address: raw.property_address ?? '',
//     startDate: raw.startDate,
//     endDate: raw.endDate,
//     updatedAt: raw.log_updated_at,
//     clauseDocId: clauseDocId || undefined,
//     clauses,
//     approvedCount,
//     totalCount,
//     unresolvedCount,
//   };
// };

// export function extractLeasesArray(leaseListFromStore: any): ApiLease[] {
//   // supports: array | { data: [...] } | { data: { data: [...] } }
//   if (Array.isArray(leaseListFromStore)) return leaseListFromStore as ApiLease[];
//   const outer = leaseListFromStore?.data;
//   if (Array.isArray(outer)) return outer as ApiLease[];
//   const inner = outer?.data;
//   if (Array.isArray(inner)) return inner as ApiLease[];
//   return [];
// }


// components/leases/utils.ts
import type { ApiLease, ApiClause, UILease, UIClause } from '@/types/loi';
import type { RiskLevel, ClauseStatus } from '@/types/loi';

const riskFromApi = (apiRisk?: string): RiskLevel => {
  if (!apiRisk) return 'Low';
  const m = apiRisk.match(/\((\d+)\/10\)/);
  const n = parseInt(m?.[1] ?? '0', 10);
  if (n >= 7) return 'High';
  if (n >= 4) return 'Medium';
  return 'Low';
};

const statusFromApi = (apiStatus?: string): ClauseStatus => {
  const s = (apiStatus || '').toLowerCase();
  if (s === 'approved') return 'Approved';
  if (s === 'edited') return 'Edited';
  if (s === 'pending') return 'Pending';
  if (s === 'review' || s === 'needs_review') return 'Needs Review';
  return 'AI Suggested';
};

export const normalizeLease = (raw: ApiLease): UILease => {
  const rawClauses = (raw?.clauses ?? {}) as Record<string, unknown>;
  const clauseDocIdRaw = (rawClauses as Record<string, unknown>)['_clause_log_id'];
  const clauseDocId = clauseDocIdRaw != null ? String(clauseDocIdRaw) : '';

  const clauses: UIClause[] = Object.entries(rawClauses)
    .filter(([k]) => k !== '_clause_log_id')
    .map(([name, v], i) => {
      const val = (typeof v === 'object' && v !== null ? (v as ApiClause) : {}) as ApiClause;
      return {
        id: String(i + 1),
        name,
        status: statusFromApi(val.status),
        risk: riskFromApi(val.risk),
        currentVersion: val.current_version ?? '',
        aiSuggestion: val.ai_suggested_clause_details ?? '',
        details: val.clause_details ?? '',
      };
    });

  const approvedCount = clauses.filter(c => c.status === 'Approved').length;
  const totalCount = clauses.length;
  const unresolvedCount = clauses.filter(
    c => c.status === 'Needs Review' || c.risk === 'High'
  ).length;

  return {
    id: String(raw.id),
    title: raw.title,
    property_address: raw.property_address ?? '',
    startDate: raw.startDate,
    endDate: raw.endDate,
    updatedAt: raw.log_updated_at,
    clauseDocId: clauseDocId || undefined,
    clauses,
    approvedCount,
    totalCount,
    unresolvedCount,
  };
};

export function extractLeasesArray(leaseListFromStore: unknown): ApiLease[] {
  if (Array.isArray(leaseListFromStore)) return leaseListFromStore as ApiLease[];

  if (
    leaseListFromStore &&
    typeof leaseListFromStore === 'object' &&
    'data' in leaseListFromStore
  ) {
    const outer = (leaseListFromStore as { data: unknown }).data;
    if (Array.isArray(outer)) return outer as ApiLease[];
    if (outer && typeof outer === 'object' && 'data' in outer) {
      const inner = (outer as { data: unknown }).data;
      if (Array.isArray(inner)) return inner as ApiLease[];
    }
  }
  return [];
}
