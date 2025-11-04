// utils/leasemappers.ts
import type { UIClause, RiskLevel, ClauseStatus } from "@/types/loi";

type RawLease = {
  _id?: string;
  submit_status?: string;
  file_url?: string | { pdf_url?: string };
  BASIC_INFORMATION?: { title?: string; lease_type?: string; landlord_legal_name?: string; tenant_legal_name?: string };
  TERM_TIMING_TRIGGERS?: { initial_term_years?: number; commencement_date_certain?: string };
  RENT_ECONOMICS?: { monthly_rent?: number | null };
  template_data?: {
    header?: { landlord_name?: string; tenant_name?: string; };
    premises?: { square_footage?: string; street_address?: string; city_state_zip?: string };
    lease_terms?: { term_display?: string; base_rent_monthly?: string; rent_commencement_date?: string };
    clauses?: { data?: Record<string, Record<string, string>> };
  };
  created_at?: string;
  updated_at?: string;
};

export type UILeaseForPage = {
  id: string;
  title: string;
  leaseType: string;
  submitStatus: string;
  propertyAddress?: string;
  landlordName: string;
  tenantName: string;
  squareFootage?: string | number;
  termDisplay?: string;
  rentAmount?: string;
  commencementDate?: string;
  pdfUrl?: string;
  clauses: UIClause[];
  totalCount: number;
  approvedCount: number;
  unresolvedCount: number;
};

const defaultStatus: ClauseStatus = "Pending";
const defaultRisk: RiskLevel = "Medium";

/** Safe parse for file_url which may come as a stringified object with single quotes */
function parsePdfUrl(file_url?: string | { pdf_url?: string }): string | undefined {
  if (!file_url) return undefined;
  if (typeof file_url !== "string") return file_url.pdf_url;
  try {
    const parsed = JSON.parse(file_url.replace(/'/g, '"'));
    return parsed?.pdf_url;
  } catch {
    return undefined;
  }
}

/** Build UIClause[] from template_data.clauses.data */
function buildClauses(raw?: RawLease["template_data"]): UIClause[] {
  const out: UIClause[] = [];
  const groups = raw?.clauses?.data ?? {};
  let i = 0;

  for (const [category, clauses] of Object.entries(groups)) {
    for (const [key, text] of Object.entries(clauses)) {
      const name = `${category} #${key}`; // stable key used by accept/reject flow
      out.push({
        id: i++,
        name,
        status: defaultStatus,
        risk: defaultRisk,
        currentVersion: text ?? "",
        aiSuggestion: undefined,
        commentsUnresolved: 0,
        tags: [category],
      });
    }
  }
  return out;
}

/** Main mapper for the page */
export function mapApiLeaseToUI(raw?: RawLease): UILeaseForPage | null {
  if (!raw?._id) return null;

  const title =
    raw.BASIC_INFORMATION?.title?.trim() ||
    raw.template_data?.header?.tenant_name?.trim() ||
    "Untitled Lease";

  const propertyAddress =
    [raw.template_data?.premises?.street_address, raw.template_data?.premises?.city_state_zip]
      .filter(Boolean)
      .join(", ");

  const clauses = buildClauses(raw.template_data);
  const total = clauses.length;
  const approved = clauses.filter(c => (c.status || "").toLowerCase().includes("approve")).length;
  const unresolved = clauses.filter(c => !c.status || c.status === "Pending").length;

  return {
    id: raw._id,
    title,
    leaseType: raw.BASIC_INFORMATION?.lease_type || "N/A",
    submitStatus: raw.submit_status || "Draft",
    propertyAddress,
    landlordName: raw.template_data?.header?.landlord_name || raw.BASIC_INFORMATION?.landlord_legal_name || "N/A",
    tenantName: raw.template_data?.header?.tenant_name || raw.BASIC_INFORMATION?.tenant_legal_name || "N/A",
    squareFootage: raw.template_data?.premises?.square_footage,
    termDisplay: raw.template_data?.lease_terms?.term_display,
    rentAmount: raw.template_data?.lease_terms?.base_rent_monthly ?? String(raw.RENT_ECONOMICS?.monthly_rent ?? ""),
    commencementDate: raw.template_data?.lease_terms?.rent_commencement_date ?? raw.TERM_TIMING_TRIGGERS?.commencement_date_certain,
    pdfUrl: parsePdfUrl(raw.file_url),
    clauses,
    totalCount: total,
    approvedCount: approved,
    unresolvedCount: unresolved,
  };
}
