// types/loi.ts
// export interface FormValues {
//   // Step 1
//   doc_id: string;
//   title: string;
//   propertyAddress: string;
//   landlordName: string;
//   landlordEmail: string;
//   tenantName: string;
//   tenantEmail: string;
//   addFileNumber: boolean;

//   // Step 2 – Lease Terms
//   rentAmount: string;
//   prepaidRent: string;
//   securityDeposit: string;
//   leaseType: string;              // string only
//   leaseDuration: string;          // months (number-as-string)
//   rentEsclation: string;          // months (number-as-string)
//   rentEscalationPercent: string;  // percent 0..100 (number-as-string)
//   includeRenewalOption: boolean;  // checkbox to reveal the two fields below
//   renewalOptionsCount: string;    // integer >= 1 (number-as-string)
//   renewalYears: string;           // integer >= 1 (number-as-string)
//   startDate: string;

//   // Back-compat (optional)
//   RentEscalation?: string;
//   PrepaidRent?: string;
//   LeaseType?: string;

//   // Step 3 – Property Details
//   propertySize: string;           // sq ft (number-as-string)
//   hasExtraSpace: boolean;
//   patio: string;
//   intendedUse: string;
//   exclusiveUse: string;
//   propertyType: string;
//   parkingSpaces: string;
//   utilities: {
//     electricity: boolean;
//     waterSewer: boolean;
//     naturalGas: boolean;
//     internetCable: boolean;
//     hvac: boolean;
//     securitySystem: boolean;
//     other: boolean;
//   };

//   // Step 4 – Additional Terms
//   renewalOption: boolean;
//   renewalOptionDetails: string;

//   rightOfFirstRefusal: boolean;
//   rightOfFirstRefusalDetails: string;

//   leaseToPurchase: boolean;
//   leaseToPurchaseDetails: string;

//   improvementAllowanceEnabled: boolean; // checkbox
//   improvementAllowanceAmount: string;   // $/sf (number-as-string)
//   improvementAllowance: string;         // legacy free-text

//   specialConditions: string;
//   financingApproval: boolean;
//   environmentalAssessment: boolean;
//   zoningCompliance: boolean;
//   permitsLicenses: boolean;
//   propertyInspection: boolean;
//   insuranceApproval: boolean;

//   // Step 5
//   terms: boolean;
// }


export interface Step {
  id: number;
  title: string;
  subtitle: string;
}
// types/loi.ts (or types/api.ts if you separate DTOs)
export type SubmitStatus = 'Draft' | 'Submitted';

export interface LOIApiPayload {
  title: string;
  propertyAddress: string;
  addFileNumber: boolean;
  loiId?: string;            // optional external id
  doc_id?: string;           // persisted id

  partyInfo: {
    landlord_name: string;
    landlord_email: string;
    tenant_name: string;
    tenant_email: string;
  };

  leaseTerms: {
    monthlyRent: string;
    securityDeposit: string;
    leaseType: string;           // mapped from form.leaseType
    leaseDuration: string;
    startDate: string;           // ISO YYYY-MM-DD
    RentEscalation: string;      // keep backend spelling (string)
    prepaidRent: string;         // string for backend compatibility
    // 🔻 New: renewal fields
    includeRenewalOption: boolean; // UI checkbox
    renewalYears: string;          // keep as string for backend
    renewalOptionsCount: string;   // keep as string for backend
  };

  propertyDetails: {
    propertySize: string;
    intendedUse: string;
    exclusiveUse: string;
    propertyType: string;

    patio?: string;               // optional
    hasExtraSpace: boolean;       // UI checkbox

    amenities: string[];          // e.g. ["8–10"]
    utilities: string[];          // e.g. ["Electricity", "Other"]
  };

  additionalDetails: {
    Miscellaneous_items: string[];
    tenantImprovement: string;    // single text field your API expects
    specialConditions: string;
    contingencies: string[];      // array, not string
    rightOfFirstRefusal?: boolean;
    leaseToPurchase?: boolean;

    // 🔻 New: improvements flags
    improvementAllowanceEnabled?: boolean;
    improvementAllowanceAmount?: string; // keep as string for backend
  };

  submit_status: SubmitStatus;
}

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
  size: string;
  type: string;
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
  updatedAt?:string    // e.g., "2.4 MB"
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