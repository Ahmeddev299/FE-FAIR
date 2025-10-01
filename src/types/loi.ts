export const EMPTY_MAINT = {
  structural: { landlord: false, tenant: false },
  nonStructural: { landlord: false, tenant: false },
  hvac: { landlord: false, tenant: false },
  plumbing: { landlord: false, tenant: false },
  electrical: { landlord: false, tenant: false },
  commonAreas: { landlord: false, tenant: false },
  utilities: { landlord: false, tenant: false },
  specialEquipment: { landlord: false, tenant: false },
} as const;


export type MaintKey = keyof typeof EMPTY_MAINT;

export type MaintenanceRowDTO = { landlord?: boolean; tenant?: boolean };

export type MaintenanceDTO = Partial<Record<MaintKey, MaintenanceRowDTO>>;

export type LoiDTO = {
  title?: string;
  loiId: string;
  // legacy single-line (keep for backward compat)
  propertyAddress?: string;

  // ✅ NEW: structured property address (all optional)
  property_address_S1?: string;
  property_address_S2?: string;
  property_city?: string;
  property_state?: string; // 2-letter
  property_zip?: string;

  addFileNumber: boolean;
  doc_id: string;

  partyInfo?: {
    landlord_name?: string;
    landlord_email?: string;
    tenant_name?: string;
    tenant_email?: string;

    // legacy single-line addresses (keep)
    landlord_home_town_address?: string;
    tenant_home_town_address?: string;

    // ✅ NEW: structured landlord address
    landlord_address_S1?: string;
    landlord_address_S2?: string;
    landlord_city?: string;
    landlord_state?: string; // 2-letter
    landlord_zip?: string;

    // ✅ NEW: structured tenant address
    tenant_address_S1?: string;
    tenant_address_S2?: string;
    tenant_city?: string;
    tenant_state?: string;   // 2-letter
    tenant_zip?: string;
  };

  leaseTerms?: {
    monthlyRent?: string;
    securityDeposit?: string;
    leaseDuration?: string;   // months
    startDate?: string;       // ISO
    rentstartDate?: string;
    prepaidRent?: string;
    leaseType?: string;

    // legacy/alt spellings
    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;
    rentEsclation?: string; // legacy misspelling

    // ✅ NEW
    rentEscalationType?: "percent" | "fmv";
    rentEscalationPercent?: string;

    includeRenewalOption?: boolean;
    renewalYears?: string;
    renewalOptionsCount?: string;
    percentageLeasePercent?: string
  };

  propertyDetails?: {
    propertySize?: string;
    patio?: string;
    intendedUse?: string;
    exclusiveUse?: string;
    propertyType?: string;
    amenities?: string;       // "8–10"
    utilities?: string[];     // ["Electricity", ...]
    hasExtraSpace?: boolean;

    deliveryCondition?: string;

    maintenance?: {
      structural?: { landlord?: boolean; tenant?: boolean };
      nonStructural?: { landlord?: boolean; tenant?: boolean };
      hvac?: { landlord?: boolean; tenant?: boolean };
      plumbing?: { landlord?: boolean; tenant?: boolean };
      electrical?: { landlord?: boolean; tenant?: boolean };
      commonAreas?: { landlord?: boolean; tenant?: boolean };
      utilities?: { landlord?: boolean; tenant?: boolean };
      specialEquipment?: { landlord?: boolean; tenant?: boolean };
    };
  };

  additionalDetails?: {
    tenantImprovement?: string;
    renewalOption?: boolean;
    specialConditions?: string;
    contingencies?: string[];
    rightOfFirstRefusal?: boolean;
    leaseToPurchase?: boolean;
    leaseToPurchaseDuration?: string;

    Miscellaneous_items?: string[];
    Miscellaneous_details?: {
      rightOfFirstRefusalDetails?: string;
      leaseToPurchaseDetails?: string;
    };
  };
};

export interface FormValues {
  doc_id: string;
  title: string;
  propertyAddress: string;
  landlordName: string;
  landlordEmail: string;
  tenantName: string;
  tenantEmail: string;
  landlord_home_town_address: string;
  tenant_home_town_address: string;
  addFileNumber: boolean;

  property_address_S1: string;
  property_address_S2: string;
  property_city: string;
  property_state: string;
  property_zip: string;

  landlord_address_S1: string;
  landlord_address_S2: string;
  landlord_city: string;
  landlord_state: string;
  landlord_zip: string;

  tenant_address_S1: string;
  tenant_address_S2: string;
  tenant_city: string;
  tenant_state: string;
  tenant_zip: string;

  rentAmount: string;
  prepaidRent: string;
  securityDeposit: string;
  leaseType: string;
  leaseDuration: string;
  rentEscalationPercent: string;
  includeRenewalOption: boolean;
  renewalOptionsCount: string;
  renewalYears: string;
  startDate: string;
  rentstartDate: string;
  deliveryCondition: string,
  maintenance: {
    structural: { landlord: boolean, tenant: boolean },
    nonStructural: { landlord: boolean, tenant: boolean },
    hvac: { landlord: boolean, tenant: boolean },
    plumbing: { landlord: boolean, tenant: boolean },
    electrical: { landlord: boolean, tenant: boolean },
    commonAreas: { landlord: boolean, tenant: boolean },
    utilities: { landlord: boolean, tenant: boolean },
    specialEquipment: { landlord: boolean, tenant: boolean },
  },
  rentEscalationType: string,
  RentEscalation?: string;
  PrepaidRent?: string;
  LeaseType?: string;
  percentageLeasePercent: string; // % of gross sales revenue for Percentage Lease

  // Step 3 (Property Details)
  propertySize: string;
  hasExtraSpace: boolean;
  patio: string;
  intendedUse: string;
  exclusiveUse: string;
  propertyType: string;
  parkingSpaces: string;
  utilities: {
    electricity: boolean;
    waterSewer: boolean;
    naturalGas: boolean;
    internetCable: boolean;
    hvac: boolean;
    securitySystem: boolean;
    other: boolean;
  };

  // Step 4 (Additional Terms)
  renewalOption: boolean;
  renewalOptionDetails: string;

  rightOfFirstRefusal: boolean;
  rightOfFirstRefusalDetails: string;

  leaseToPurchase: boolean;
  leaseToPurchaseDetails: string;
  leaseToPurchaseDuration: string,

  improvementAllowanceEnabled: boolean;
  improvementAllowanceAmount: string;

  improvementAllowance: string;
  specialConditions: string;

  financingApproval: boolean;
  environmentalAssessment: boolean;
  zoningCompliance: boolean;
  permitsLicenses: boolean;
  propertyInspection: boolean;
  insuranceApproval: boolean;

  // Step 5
  terms: boolean;
}

export interface Step {
  id: number;
  title: string;
  subtitle: string;
}
// types/loi.ts (or types/api.ts if you separate DTOs)
export type SubmitStatus = 'Draft' | 'Submitted';

// "@/types/loi"
export type LOIApiPayload = {
  title: string;

  addFileNumber: boolean;
  doc_id?: string;

  partyInfo: {
    landlord_name: string;
    landlord_email: string;
    tenant_name: string;
    tenant_email: string;

    // NEW
    landlord_home_town_address?: string;
    tenant_home_town_address?: string;
  };

    leaseTerms?: {
    monthlyRent: string;
    securityDeposit: string;
    leaseDuration: string;
    startDate: string;
    rentstartDate?: string;
    prepaidRent: string;
    leaseType: string;

    // legacy
    RentEscalation?: string;
    PrepaidRent?: string;
    LeaseType?: string;
    rentEsclation?: string;

    // escalation
    rentEscalationType?: "percent" | "fmv";
    rentEscalationPercent?: string;

    includeRenewalOption: boolean;
    renewalYears?: string;
    renewalOptionsCount?: string;

    // ✅ make optional
    percentageLeasePercent?: string;
  };

  propertyDetails: {
    propertySize: string;
    intendedUse: string;
    exclusiveUse: string;     // FIX: boolean, not string
    propertyType: string;
    hasExtraSpace: boolean;
    patio?: string;
    amenities: string;         // e.g. "8–10"
    utilities: string[];       // ["Electricity", "HVAC", ...]
    // NEW
    deliveryCondition?: string; // "as_is" | "shell" | "vanilla_shell" | "turnkey" | "white_box"
    maintenance?: {
      structural?: { landlord?: boolean; tenant?: boolean };
      nonStructural?: { landlord?: boolean; tenant?: boolean };
      hvac?: { landlord?: boolean; tenant?: boolean };
      plumbing?: { landlord?: boolean; tenant?: boolean };
      electrical?: { landlord?: boolean; tenant?: boolean };
      commonAreas?: { landlord?: boolean; tenant?: boolean };
      utilities?: { landlord?: boolean; tenant?: boolean };
      specialEquipment?: { landlord?: boolean; tenant?: boolean };
    };
  };

  additionalDetails: {
    Miscellaneous_items: string[];
    tenantImprovement: string;
    improvementAllowanceEnabled: boolean;
    improvementAllowanceAmount: string;
    specialConditions: string;
    contingencies: string[];
    rightOfFirstRefusal?: boolean;

    leaseToPurchase?: boolean;
    leaseToPurchaseDuration?: string
  };

  submit_status: "Submitted" | "Draft";
};


export type LOIStatus = 'Draft' | 'Sent' | 'Approved';
export interface Letter {
  id: string;  // ← instead of number
  title: string;
  propertyAddress?: string;
  updated_at?: string;
  submit_status: LOIStatus;
}


export interface PartyInfo {
  landlord_name: string;
  landlord_email: string;
  tenant_name: string;
  tenant_email: string;
}

export interface LeaseTerms {
  monthlyRent: string;
  securityDeposit: string;
  leaseType: string;
  leaseDuration: string;
  startDate: string | null;
}

export interface PropertyDetails {
  propertySize: string;
  intendedUse: string;
  propertyType: string;
  amenities: string[];
  utilities: string[];
}

export interface AdditionalDetails {
  renewalOption: boolean;
  tenantImprovement: string;
  specialConditions: string;
  contingencies: string;
}

export interface FullLOI {
  id?: number;
  title: string;
  propertyAddress: string;
  submit_status: LOIStatus;
  updated_at?: string;
  assignee?: string;

  partyInfo: PartyInfo;
  leaseTerms: LeaseTerms;
  propertyDetails: PropertyDetails;
  additionalDetails: AdditionalDetails;
}

export interface CustomFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
}

export interface FileData {
  name: string;
  size: string;      // e.g. "12.34 KB"
  type: string;      // mime type
  file: File;
}

// in @/types/loi.ts
export interface LeaseFormValues {
  title: string;
  startDate: string;
  endDate: string;
  propertyAddress: string;
  notes: string;
  document: string;
  leaseId?: string;     // optional
  leaseTitle?: string;  // optional (but you already have `title`)p
}

export type SetFieldValue = (field: string, value: File | null) => void;

// Extended FormikErrors to handle File type properly
export interface ExtendedFormikErrors {
  document?: string;
}

// Extend shared Clause with optional fields this modal uses
export type ExtendedClause = Clause & {
  lastEdited?: string;
  editor?: string;
  originalText?: string;
  aiSuggestion?: string;
  currentVersion?: string;

  // Add these so we don't need "as any"
  status?: string;
  risk?: string;

  // Optional display helpers
  title?: string;
  name?: string;
};


export interface Clause {
  id: number | string;
  name: string;
  description?: string;
  status: ClauseStatus;
  risk: RiskLevel;
  comments?: number;
  unresolved?: boolean;
}

export interface Lease {
  id: number | string;
  title: string;               // e.g. "Common Area Maintena"
  property_address?: string;   // may be blank
  clauses: Clause[];
  // optional server-calculated progress
  approvedCount?: number;
  totalCount?: number;
  unresolvedCount?: number;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface ClauseData {
  risk: string; // "Low (2/10)"
  status: "approved" | "pending" | "rejected";
  current_version: string;
  ai_suggested_clause_details: string;
  clause_details: string;

  // optional id fields (your API might use one of these)
  clause_id?: string;
  id?: string;
  _id?: string;
}

export type HistoryMap = Record<string, ClauseData>;
export type HistoryMetaMap = Record<string, { id?: string } | undefined>;


export type UILease = {
  id: string;
  title: string;
  property_address: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
  clauseDocId?: string; // backend _clause_log_id if present
  clauses: UIClause[];
  approvedCount: number;
  totalCount: number;
  unresolvedCount: number;
};

// Shapes we expect from API/store
export type ApiClause = {
  status?: string;
  risk?: string;
  current_version?: string;
  ai_suggested_clause_details?: string;
  clause_details?: string;
};

export type ApiLease = {
  id: string | number;
  title: string;
  property_address?: string;
  startDate?: string;
  endDate?: string;
  log_updated_at?: string;
  clauses?: Record<string, unknown>;
};

// UI-only types you can reuse everywhere
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ClauseStatus = 'AI Suggested' | 'Edited' | 'Approved' | 'Needs Review' | 'Pending' | 'Suggested';

export type UIClause = {
  id: string;
  name: string;               // e.g., "Common Area Maintenance"
  category?: string;          // e.g., "CAM Charges"
  status: ClauseStatus;
  risk: RiskLevel;
  lastEditedAt?: string;      // ISO
  lastEditedBy?: string;      // e.g., "AI Assistant"
  commentsUnresolved?: number;
  currentVersion: string;
  aiSuggestion?: string;
  details?: string;
};

export type UILeaseBrief = {
  id: string;
  title: string;
  type: 'Lease' | 'LOI' | 'Notice' | 'Termination';
  documentId?: string;        // e.g., "2025-001"
  status?: string;            // e.g., "Signed", "Draft", "Pending"
  tags?: string[];            // e.g., ["Termination Clause", "Indemnity"]
  sizeLabel?: string;
  updatedAt?: string    // e.g., "2.4 MB"
};

export type UILeaseFull = {
  id: string;
  title: string;
  propertyAddress?: string;
  clauses: UIClause[];
  approvedCount?: number;
  totalCount?: number;
  unresolvedCount?: number;
};