// src/utils/leaseMappers.ts
import type { UIClause, UILeaseFull } from '@/types/loi';


type ApiComment = {
  text?: string;
  author?: string;
  created_at?: string;
};

type ApiClause = {
  status?: string;
  clause_details?: string;
  current_version?: string;
  ai_confidence_score?: number;
  ai_suggested_clause_details?: string;
  comment?: ApiComment[];
  risk?: string;
  created_at?: string;
  updated_at?: string;
  accepted_ai?: boolean;
};

export type ApiLeaseDetail = {
  id: string;
  title: string;
  property_address?: string;
  log_updated_at?: string;
  clauses?: {
    _clause_log_id?: string;
    [clauseName: string]: ApiClause | string | undefined;
  };
};

export type UILeaseFullWithDoc = UILeaseFull & {
  clauseDocId?: string;
};

export const riskFromApi = (risk?: string): 'Low' | 'Medium' | 'High' => {
  if (!risk) return 'Low';
  const n = parseInt(risk.match(/\((\d+)\/10\)/)?.[1] ?? '0', 10);
  if (n >= 7) return 'High';
  if (n >= 4) return 'Medium';
  return 'Low';
};

export const statusFromApi = (s?: string, risk?: string): UIClause['status'] => {
  const low = (s || '').toLowerCase();
  if (low === 'approved') return 'Approved';
  if (low === 'pending') return 'Pending';
  if (low === 'accept_ai_suggestion') return 'Approved';
 
  return riskFromApi(risk) === 'High' ? 'Needs Review' : 'Edited';
};

export const categoryFromName = (name: string): UIClause['category'] => {
  const n = name.toLowerCase();
  if (n.includes('cam') || n.includes('common area')) return 'CAM Charges';
  if (n.includes('indemn')) return 'Indemnity';
  if (n.includes('terminat')) return 'Termination';
  if (n.includes('rent')) return 'Rent';
  return 'Terms & Conditions';
};

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isApiLeaseDetail(x: unknown): x is ApiLeaseDetail {
  return (
    isObject(x) &&
    typeof x.id === 'string' &&
    typeof x.title === 'string'
  );
}

type EnvelopeWithData = { data: unknown };
type EnvelopeWithNestedData = { data: { data: unknown } };

function isEnvelopeWithData(x: unknown): x is EnvelopeWithData {
  return isObject(x) && 'data' in x;
}

function isEnvelopeWithNestedData(x: unknown): x is EnvelopeWithNestedData {
  if (!isObject(x)) return false;
  const d = (x as Record<string, unknown>).data;
  return isObject(d) && 'data' in d;
}

function isApiClause(x: unknown): x is ApiClause {
  return isObject(x);
}

export const extractOne = (payload: unknown): ApiLeaseDetail | null => {
  if (isApiLeaseDetail(payload)) return payload;

  if (isEnvelopeWithNestedData(payload)) {
    const inner = (payload as EnvelopeWithNestedData).data.data;
    if (isApiLeaseDetail(inner)) return inner;
  }

  if (isEnvelopeWithData(payload)) {
    const inner = (payload as EnvelopeWithData).data;
    if (isApiLeaseDetail(inner)) return inner;
  }

  return null;
};


export type ClauseComment = {
  text: string;
  author?: string;
  created_at?: string;
};

export const mapToUILease = (raw: ApiLeaseDetail | null): UILeaseFullWithDoc | null => {
  if (!raw) return null;

  const clausesObj = raw.clauses ?? {};
  const entries = Object.entries(clausesObj).filter(([k]) => k !== '_clause_log_id');

  const clauses: UIClause[] = entries.map(([name, v], idx) => {
    const val: ApiClause = isApiClause(v) ? v : {};
    return {
      id: String(idx + 1),
      name,
      category: categoryFromName(name),
      status: statusFromApi(val.status, val.risk),
      risk: riskFromApi(val.risk),
      lastEditedAt: val.updated_at,
      lastEditedBy:
        val.updated_at && (val.status || '').toLowerCase() === 'pending'
          ? 'AI Assistant'
          : undefined,
      commentsUnresolved: Array.isArray(val.comment) ? val.comment.length : 0,
      currentVersion: val.current_version ?? '',
      aiSuggestion: val.ai_suggested_clause_details ?? '',
      details: val.clause_details ?? '',
    };
  });

  return {
    id: raw.id,
    title: raw.title || 'Untitled Lease',
    propertyAddress: raw.property_address ?? '',
    clauses,
    approvedCount: clauses.filter((c) => c.status === 'Approved').length,
    totalCount: clauses.length,
    unresolvedCount: clauses.filter(
      (c) => c.status === 'Needs Review' || (c.commentsUnresolved ?? 0) > 0
    ).length,
    clauseDocId: raw.clauses?._clause_log_id, 
  };
};


