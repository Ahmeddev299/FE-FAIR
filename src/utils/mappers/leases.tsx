// src/utils/mappers/leases.ts
import type { UILeaseBrief } from "@/types/loi";

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

export type ApiLeaseItem = {
  id: string;
  title: string;
  url?: string;
  property_address?: string;
  startDate?: string;  
  endDate?: string;    
  status?: string;
  risk?: string;
  action?: string;
  comments?: string;
  log_updated_at?: string; 
  clauses?: {
    _clause_log_id?: string;
    [clauseName: string]: ApiClause | string | undefined;
  };
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

export type UILeaseBriefRow = UILeaseBrief & {
  _clauseDocId?: string;
  _address?: string;
  _updatedAt?: string;
};

const getRiskScore = (risk?: string): number => {
  const m = (risk || "").match(/\((\d+)\/10\)/);
  return m ? parseInt(m[1], 10) : 0;
};

const isApiClauseObject = (v: unknown): v is ApiClause =>
  typeof v === "object" && v !== null;

const anyHighRisk = (item: ApiLeaseItem): boolean => {
  const clauses = item.clauses ?? {};
  return Object.entries(clauses)
    .filter(([k]) => k !== "_clause_log_id")
    .some(([, v]) => isApiClauseObject(v) && getRiskScore(v.risk) >= 7);
};

const deriveType = (title?: string): UILeaseBrief["type"] => {
  const t = (title || "").toLowerCase();
  if (t.startsWith("loi")) return "LOI";
  if (t.includes("notice")) return "Notice";
  if (t.includes("termination")) return "Termination";
  return "Lease";
};

const daysUntil = (iso?: string): number => {
  if (!iso) return Number.POSITIVE_INFINITY;
  const now = Date.now();
  const then = Date.parse(iso);
  return Math.ceil((then - now) / (1000 * 60 * 60 * 24));
};

const deriveStatus = (item: ApiLeaseItem): UILeaseBrief["status"] => {
  const d = daysUntil(item.endDate);
  if (d <= 7) return "Expiring";

  const clauses = item.clauses ?? {};
  const entries = Object.entries(clauses).filter(([k]) => k !== "_clause_log_id");
  if (entries.length === 0) return "Draft";

  const allApproved = entries.every(([, v]) => isApiClauseObject(v) && v.status?.toLowerCase() === "approved");
  if (allApproved) return "Signed";

  const anyPending = entries.some(([, v]) => isApiClauseObject(v) && v.status?.toLowerCase() === "pending");
  if (anyPending) return "Pending";

  return "Draft";
};

const extractTags = (item: ApiLeaseItem): string[] => {
  const tags = new Set<string>();
  if (anyHighRisk(item)) tags.add("High Risk");

  const clauseNames = Object.keys(item.clauses ?? {}).filter(k => k !== "_clause_log_id");
  for (const name of clauseNames) {
    const low = name.toLowerCase();
    if (low.includes("4")) tags.add("Termination Clause");
    if (low.includes("indemn")) tags.add("Indemnity");
    if (low.includes("renewal")) tags.add("Renewal Option");
    if (low.includes("security deposit")) tags.add("Security Deposit");
    if (low.includes("delivery") || low.includes("commencement")) tags.add("Commencement");
  }

  return Array.from(tags).slice(0, 3);
};

export const getClauseDocId = (item: ApiLeaseItem): string | undefined =>
  item.clauses?._clause_log_id || undefined;

type EnvelopeWithArray = { data: ApiLeaseItem[] };
type EnvelopeWithPagination = { data: { data: ApiLeaseItem[] } };
type MaybeItems =
  | ApiLeaseItem[]
  | EnvelopeWithArray
  | EnvelopeWithPagination
  | undefined;

const extractItems = (src: MaybeItems): ApiLeaseItem[] => {
  if (!src) return [];
  if (Array.isArray(src)) return src;
  if ("data" in src) {
    const outer = (src as EnvelopeWithArray | EnvelopeWithPagination).data;
    if (Array.isArray(outer)) return outer;
    if (outer && typeof outer === "object" && "data" in outer) {
      const inner = (outer as { data: unknown }).data;
      if (Array.isArray(inner)) return inner as ApiLeaseItem[];
    }
  }
  return [];
};

export const mapLeaseListToUI = (
  res: ApiLeaseListResponse | ApiLeaseItem[] | EnvelopeWithArray | undefined
): UILeaseBriefRow[] => {
  const items = extractItems(
    Array.isArray(res) ? res : res?.data ?? (res as unknown as EnvelopeWithArray)
  );

  return items.map((item): UILeaseBriefRow => ({
    id: item.id,
    title: item.title || "Untitled Lease",
    type: deriveType(item.title),
    documentId: item.id,
    status: deriveStatus(item),
    tags: extractTags(item),
    sizeLabel: "",
    _clauseDocId: getClauseDocId(item),
    _address: item.property_address,
    _updatedAt: item.log_updated_at,
  }));
};
